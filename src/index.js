import React from 'react';
import ReactDOM from 'react-dom';

function withOnBlur() {
  return function (WrappedComponent) {
    class WithOnBlur extends React.PureComponent {
      blurCallback = () => {};

      setBlurListener = callback => {
        console.log('setBlurListener');
        this.blurCallback = callback;
        document.addEventListener('click', this.onClick);
        document.addEventListener('keyup', this.onKeyUp);
      };

      unsetBlurListener = () => {
        console.log('xxxxx', 'unsetBlurListener');
        document.removeEventListener('click', this.onClick);
        document.removeEventListener('keyup', this.onKeyUp);
      };

      onClick = e => {
        console.log(10000000000, e.type);
        this.checkAndBlur(e.target, e);
      };

      onKeyUp = e => {
        if (e.keyCode === 9) {
          console.log('-------------', e.type);
          this.checkAndBlur(e.target, e);
        }
      };

      checkAndBlur = (element, e) => {
        if (!this.blurCallback) return false;
        if (!this.inArea(element)) {
          this.blurCallback(e);
        }
      };

      inArea = domNode => {
        const parentNode = ReactDOM.findDOMNode(this);
        let el = domNode;
        while (el) {
          if (el === parentNode) return true;
          el = el.parentNode;
        }

        return false;
      };

      render() {
        return (
          <WrappedComponent
            {...this.props}
            setBlurListener={this.setBlurListener}
            unsetBlurListener={this.unsetBlurListener}
          />
        );
      }
    }

    WithOnBlur.displayName = `WithOnBlur(${WrappedComponent.displayName || WrappedComponent.name || 'component'})`;

    return WithOnBlur;
  };
}

export default withOnBlur;
