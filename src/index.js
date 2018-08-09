import React from 'react';
import ReactDOM from 'react-dom';

function withOnBlur({ ifClick = true, ifKeyUp = true } = {}) {
  return function (WrappedComponent) {
    if (!(ifClick || ifKeyUp)) return WrappedComponent;

    class WithOnBlur extends React.PureComponent {
      blurCallback = undefined;
      
      componentWillUnmount() {
        this.unsetBlurListener();
      }

      setBlurListener = callback => {
        this.blurCallback = callback;
        if (!callback) return false;
        if (ifClick) document.addEventListener('click', this.onDocumentClick);
        if (ifKeyUp) document.addEventListener('keyup', this.onDocumentKeyUp);
        return true;
      };

      unsetBlurListener = () => {
        if (ifClick) document.removeEventListener('click', this.onDocumentClick);
        if (ifKeyUp) document.removeEventListener('keyup', this.onDocumentKeyUp);
      };

      onDocumentClick = e => {
        this.checkAndBlur(e.target, e);
      };

      onDocumentKeyUp = e => {
        if (e.keyCode === 9) {
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
