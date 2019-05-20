import React from 'react';
import ReactDOM from 'react-dom';

export function consoleDebug(...args) {
  return console.debug('react-onblur::', ...args);
}

/**
 * @param  {Node} parentDomNode
 * @param  {Node} domNode
 * @returns {Boolean}
 */
export function isDomElementChild (parentDomNode, domNode) {
  if (!parentDomNode || !domNode) return false;
  let el = domNode;
  while (el) {
    if (el === parentDomNode) return true;
    el = el.parentNode;
  }
  return false;
}

/**
 * @param {Boolean} listenClick - if true, then mousedown event for document will be added
 * @param {Boolean} listenTab - if true, then keydown and keyup listener for document will be added to detect tab key press
 * @param {Boolean} listenEsc - if true, then when user press Esc key the event will be called
 * @param {Boolean} autoUnset - if true, then unsetBlurListener function will be called after callback
 * @param {Boolean} debug - if true, all debug messages will be printed in console
 * @deprecated replaced by listenClick
 * @param {Boolean} ifClick
 * @deprecated replaced by listenTab
 * @param {Boolean} ifKeyUpDown
 * @deprecated replaced by listenEsc
 * @param {Boolean} ifEsc
 * @returns {HOC}
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
    ? consoleDebug
    : () => {};

  return function (WrappedComponent) {
    if (!(listenClick || listenTab || listenEsc)) return WrappedComponent;

    class WithOnBlur extends React.PureComponent {
      blurCallback = undefined;
      checkInOutside = undefined;
      isOnce = false;
      checkedElement = null;

      componentWillUnmount() {
        this.unsetBlurListener();
      }

      getOptions = callbackOrOptions => {
        return typeof(callbackOrOptions) === 'function'
          ? { onBlur: callbackOrOptions }
          : callbackOrOptions;
      }

      setBlurListener = (callbackOrOptions, once = false) => {
        debugLog('setBlurListener');
        this.checkedElement = null;
        this.blurCallback = null;

        if (!callbackOrOptions || !['function', 'object'].includes(typeof(callbackOrOptions))) {
          console.error('First param for `setBlurListener` should be callback function or object of options');
          return false;
        }
        const options = this.getOptions(callbackOrOptions);

        if (typeof(options.onBlur) !== 'function') {
          console.error('`onBlur` should be callback function');
          return false;
        }

        this.blurCallback = options.onBlur;
        this.checkInOutside = options.checkInOutside;
        this.isOnce = !!(once || options.once);

        if (listenClick) document.addEventListener('mousedown', this.onDocumentClick, true);
        if (listenEsc) document.addEventListener('keydown', this.onDocumentEsc, true);
        if (listenTab) {
          document.addEventListener('keyup', this.onDocumentKeyUp, true);
          document.addEventListener('keydown', this.onDocumentKeyDown, true);
        }
        return true;
      };

      unsetBlurListener = () => {
        debugLog('unsetBlurListener');
        if (listenClick) document.removeEventListener('mousedown', this.onDocumentClick, true);
        if (listenEsc) document.removeEventListener('keydown', this.onDocumentEsc, true);
        if (listenTab) {
          document.removeEventListener('keyup', this.onDocumentKeyUp, true);
          document.removeEventListener('keydown', this.onDocumentKeyDown, true);
        }
      };

      onDocumentClick = e => {
        debugLog('document mousedown', e);
        if (e.target !== this.checkedElement) {
          this.checkAndBlur(e.target, e);
          this.checkedElement = e.target;
        } else {
          debugLog('document mousedown event. Ignore because Element was checked');
        }
      };

      onDocumentKeyDown = e => {
        debugLog('document keyDown event', e);
        if (e.target !== this.checkedElement) {
          this.checkAndBlur(e.target, e);
          this.checkedElement = e.target;
        } else {
          debugLog('document keyDown event. Ignore because Element was checked');
        }
      };

      onDocumentKeyUp = e => {
        debugLog('document keyUp event', e);
        if (e.target !== this.checkedElement) {
          if (String(e.key).toLowerCase() === 'tab' || String(e.code).toLowerCase() === 'tab' || e.keyCode === 9) {
            this.checkAndBlur(e.target, e);
            this.checkedElement = e.target;
          }
        } else {
          debugLog('document keyUp event. Ignore because Element was checked');
        }
      };

      onDocumentEsc = e => {
        if (String(e.key).toLowerCase() === 'escape' || String(e.code).toLowerCase() === 'escape' || e.keyCode === 27) {
          debugLog('document ESC event', e);
          this.blur(e);
          this.checkedElement = e.target;
        }
      };

      checkAndBlur = (element, e) => {
        const shouldUnset = autoUnset || this.isOnce;

        debugLog('check and blur');
        if (!this.blurCallback && !shouldUnset) return false;
        if (this.inOutside(element)) {
          this.blur(e);
        }
      };

      blur = (e) => {
        const shouldUnset = autoUnset || this.isOnce;

        if (this.blurCallback) {
          debugLog('blur callback');
          this.blurCallback(e);
        }
        if (shouldUnset) {
          debugLog('blur auto unset');
          this.unsetBlurListener();
        }
      }

      inOutside = domNode => {
        const isOutside = !this.inArea(domNode);
        return typeof(this.checkInOutside) === 'function'
          ? !!this.checkInOutside(domNode, isOutside)
          : isOutside;
      }

      inArea = domNode => {
        const parentNode = ReactDOM.findDOMNode(this);
        return isDomElementChild(parentNode, domNode);
      }

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
    WithOnBlur.WrappedComponent = WrappedComponent;

    return WithOnBlur;
  };
}

export default withOnBlur;
