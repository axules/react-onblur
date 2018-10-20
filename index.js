import React from 'react';
import ReactDOM from 'react-dom';
/*
  ifClick - if true, then click event for document will be added
  ifKeyDown - if true, then keydown and keyup events for document will be added
  ifEsc - if true, then when user clicks Esc key the event will be called
  autoUnset - if true, then unsetBlurListener function will be called after callback
  debug - if true, all debug messages will be printed in console
*/
function withOnBlur({ ifClick = true, ifKeyUpDown = true, ifEsc = true, autoUnset = false, debug = false } = {}) {
  const debugLog = debug 
    ? console.debug
    : () => {};

  return function (WrappedComponent) {
    if (!(ifClick || ifKeyUpDown || ifEsc)) return WrappedComponent;

    class WithOnBlur extends React.PureComponent {
      blurCallback = undefined;
      isOnce = false;
      checkedElement = null;

      componentWillUnmount() {
        this.unsetBlurListener();
      }

      setBlurListener = (callback, once = false) => {
        debugLog('react-onblur::setBlurListener');
        this.checkedElement = null;
        this.blurCallback = callback;
        this.isOnce = !!once;
        if (!callback) return false;

        if (ifClick) document.addEventListener('click', this.onDocumentClick);
        if (ifEsc) document.addEventListener('keydown', this.onDocumentEsc);
        if (ifKeyUpDown) {
          document.addEventListener('keyup', this.onDocumentKeyUp);
          document.addEventListener('keydown', this.onDocumentKeyDown);
        }
        return true;
      };

      unsetBlurListener = () => {
        debugLog('react-onblur::unsetBlurListener');
        if (ifClick) document.removeEventListener('click', this.onDocumentClick);
        if (ifEsc) document.removeEventListener('keydown', this.onDocumentEsc);
        if (ifKeyUpDown) {
          document.removeEventListener('keyup', this.onDocumentKeyUp);
          document.removeEventListener('keydown', this.onDocumentKeyDown);
        }
      };

      onDocumentClick = e => {
        debugLog('react-onblur::document click', e);
        if (e.target !== this.checkedElement) {
          this.checkAndBlur(e.target, e);
          this.checkedElement = e.target;
        }
      };

      onDocumentKeyDown = e => {
        if (e.target === this.checkedElement) return e;

        debugLog('react-onblur::document keyDown event', e);
        this.checkAndBlur(e.target, e);
        this.checkedElement = e.target;
      };

      onDocumentKeyUp = e => {
        if (e.target === this.checkedElement) return e;

        debugLog('react-onblur::document keyUp event', e);
        if (String(e.key).toLowerCase() === 'tab' || String(e.code).toLowerCase() === 'tab' || e.keyCode === 9) {
          this.checkAndBlur(e.target, e);
          this.checkedElement = e.target;
        }
      };

      onDocumentEsc = e => {
        if (String(e.key).toLowerCase() === 'escape' || String(e.code).toLowerCase() === 'escape' || e.keyCode === 27) {
          debugLog('react-onblur::document ESC event', e);
          this.blur(e);
          this.checkedElement = e.target;
        }
      };

      checkAndBlur = (element, e) => {
        const shouldUnset = autoUnset || this.isOnce;

        debugLog('react-onblur::check and blur');
        if (!this.blurCallback && !shouldUnset) return false;
        if (!this.inArea(element)) {
          this.blur(e);
        }
      };

      blur = (e) => {
        const shouldUnset = autoUnset || this.isOnce;

        if (this.blurCallback) {
          debugLog('react-onblur::blur callback');
          this.blurCallback(e);
        }
        if (shouldUnset) {
          debugLog('react-onblur::blur auto unset');
          this.unsetBlurListener();
        }
      }

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
