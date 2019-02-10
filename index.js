import React from 'react';
import ReactDOM from 'react-dom';
/*
  ifClick - deprecated, replaced by listenClick
  ifKeyUpDown - deprecated, replaced by listenTab
  ifEsc - deprecated, replaced by listenEsc
  listenClick - if true, then mouseup event for document will be added
  listenTab - if true, then keydown and keyup listener for document will be added to detect tab key press
  listenEsc - if true, then when user press Esc key the event will be called
  autoUnset - if true, then unsetBlurListener function will be called after callback
  debug - if true, all debug messages will be printed in console
*/
function withOnBlur(props = {}) {
  const { 
    ifClick = true,
    ifKeyUpDown = true, 
    ifEsc = true, 
    autoUnset = false,
    debug = false
  } = props;
  const { 
    listenClick = ifClick,
    listenTab = ifKeyUpDown,
    listenEsc = ifEsc,
  } = props;

  const debugLog = debug 
    ? console.debug
    : () => {};

  return function (WrappedComponent) {
    if (!(listenClick || listenTab || listenEsc)) return WrappedComponent;

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

        if (listenClick) document.addEventListener('mouseup', this.onDocumentClick, true);
        if (listenEsc) document.addEventListener('keydown', this.onDocumentEsc, true);
        if (listenTab) {
          document.addEventListener('keyup', this.onDocumentKeyUp, true);
          document.addEventListener('keydown', this.onDocumentKeyDown, true);
        }
        return true;
      };

      unsetBlurListener = () => {
        debugLog('react-onblur::unsetBlurListener');
        if (listenClick) document.removeEventListener('mouseup', this.onDocumentClick, true);
        if (listenEsc) document.removeEventListener('keydown', this.onDocumentEsc, true);
        if (listenTab) {
          document.removeEventListener('keyup', this.onDocumentKeyUp, true);
          document.removeEventListener('keydown', this.onDocumentKeyDown, true);
        }
      };

      onDocumentClick = e => {
        debugLog('react-onblur::document mouseup', e);
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

    WithOnBlur.displayName = `WithOnBlur(${WrappedComponent.displayName || WrappedComponent.name || 'withOnBlur'})`;

    return WithOnBlur;
  };
}

export default withOnBlur;
