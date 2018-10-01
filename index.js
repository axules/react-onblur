import React from 'react';
import ReactDOM from 'react-dom';
/*
  ifClick - if true, then click event for document will be added
  ifKeyDown - if true, then keydow and keyup events for document will be added
  autoUnset - if true, then unsetBlurListener function will be called after callback
  debug - if true, all debug messages will be printed in console
*/
function withOnBlur({ ifClick = true, ifKeyUpDown = true, autoUnset = false, debug = false } = {}) {
  const debugLog = debug 
    ? console.debug
    : () => {};

  return function (WrappedComponent) {
    if (!(ifClick || ifKeyUpDown)) return WrappedComponent;

    class WithOnBlur extends React.PureComponent {
      blurCallback = undefined;
      testedElement = null;

      componentWillUnmount() {
        this.unsetBlurListener();
      }

      setBlurListener = callback => {
        debugLog('react-onblur::setBlurListener');
        this.testedElement = null;
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
        if (e.target !== this.testedElement) {
          this.checkAndBlur(e.target, e);
          this.testedElement = e.target;
        }
      };

      onDocumentKey = e => {
        debugLog('react-onblur::document key event', e);
        if (e.target !== this.testedElement) {
          this.checkAndBlur(e.target, e);
          this.testedElement = e.target;
        }
      };

      checkAndBlur = (element, e) => {
        debugLog('react-onblur::check and blur');
        if (!this.blurCallback) return false;
        if (!this.inArea(element)) {
          debugLog('react-onblur::blur callback');
          this.blurCallback(e);
          if (autoUnset) this.unsetBlurListener();
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
