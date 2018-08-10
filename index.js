import React from 'react';
import ReactDOM from 'react-dom';

function withOnBlur({ ifClick = true, ifKeyUpDown = true, debug = false } = {}) {
  const debugLog = debug 
    ? console.debug
    : () => {};

  return function (WrappedComponent) {
    if (!(ifClick || ifKeyUpDown)) return WrappedComponent;

    class WithOnBlur extends React.PureComponent {
      blurCallback = undefined;
      
      componentWillUnmount() {
        this.unsetBlurListener();
      }

      setBlurListener = callback => {
        debugLog('react-onblur::setBlurListener');
        this.blurCallback = callback;
        if (!callback) return false;
        if (ifClick) document.addEventListener('click', this.onDocumentClick);
        if (ifKeyUpDown) {
          document.addEventListener('keyup', this.onDocumentKey);
          document.addEventListener('keydown', this.onDocumentKey);
        }
        return true;
      };

      unsetBlurListener = () => {
        debugLog('react-onblur::unsetBlurListener');
        if (ifClick) document.removeEventListener('click', this.onDocumentClick);
        if (ifKeyUpDown) {
          document.removeEventListener('keyup', this.onDocumentKey);
          document.removeEventListener('keydown', this.onDocumentKey);
        }
      };

      onDocumentClick = e => {
        debugLog('react-onblur::document click', e);
        this.checkAndBlur(e.target, e);
      };

      onDocumentKey = e => {
        debugLog('react-onblur::document key event', e);
        if (e.keyCode === 9) {
          this.checkAndBlur(e.target, e);
        }
      };

      checkAndBlur = (element, e) => {
        debugLog('react-onblur::check and blur');
        if (!this.blurCallback) return false;
        if (!this.inArea(element)) {
          debugLog('react-onblur::blur callback');
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
