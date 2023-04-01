import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

export function consoleDebug(...args) {
  return console.debug('react-onblur::', ...args);
}

/**
 * @param  {Node} parentDomNode
 * @param  {Node} domNode
 * @returns {Boolean}
 */
export function isDomElementChild(parentDomNode, domNode) {
  if (!parentDomNode || !domNode) return false;
  // return parentDomNode == domNode || parentDomNode.contains(domNode);
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
 * @param {Boolean} ifClick - Deprecated: replaced by listenClick
 * @param {Boolean} ifKeyUpDown - Deprecated: replaced by listenTab
 * @param {Boolean} ifEsc - Deprecated: replaced by listenEsc
 * @returns {PureComponent}
 */
export function withOnBlur(props = {}) {
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

  const debugLog = debug ? consoleDebug : () => undefined;

  return function (WrappedComponent) {
    if (!(listenClick || listenTab || listenEsc)) return WrappedComponent;

    class WithOnBlur extends PureComponent {
      constructor(...args) {
        super(...args);
        this.setWorkingParams();
      }

      componentWillUnmount() {
        debugLog('componentWillUnmount');
        this.unsetListeners();
      }

      prepareOptions = (callbackOrOptions, once = undefined) => {
        return typeof(callbackOrOptions) === 'function'
          ? { onBlur: callbackOrOptions, once }
          : { ...callbackOrOptions, once: !!(once ?? callbackOrOptions.once) };
      };

      setWorkingParams = (params) => {
        this.blurCallback = undefined;
        this.focusCallback = undefined;
        this.focusNode = undefined;
        this.checkInOutside = undefined;
        this.getRootNode = undefined;
        this.isOnce = autoUnset;
        this.checkedElement = Date.now();
        this.listeners = {
          listenClick,
          listenTab,
          listenEsc
        };

        if (params) {
          this.blurCallback = params.onBlur;
          this.focusCallback = params.onFocus;
          // this.focusNode = undefined;
          this.checkInOutside = params.checkInOutside;
          this.getRootNode = params.getRootNode;
          this.isOnce = params.once ?? autoUnset;
          this.listeners = {
            listenClick: params.listenClick ?? listenClick,
            listenTab: params.listenTab ?? listenTab,
            listenEsc: params.listenEsc ?? listenEsc
          };
        }
      };

      validateParams = (
        params,
        requiredParams = { onBlur: true, onFocus: false, checkInOutside: false, getRootNode: false, once: false }
      ) => {
        const required = Object.entries(requiredParams).filter(([, v]) => v).map(([k]) => k);

        for (let i = 0; i < required.length; i += 1) {
          const k = required[i];
          if (!params[k]) {
            console.error(`'${k}' is required`);
            return false;
          }
        }

        const { onBlur, onFocus, checkInOutside, getRootNode } = params;

        if (onBlur && typeof(onBlur) !== 'function') {
          console.error('`onBlur` should be callback function');
          return false;
        }

        if (onFocus && typeof(onFocus) !== 'function') {
          console.error('`onFocus` should be callback function');
          return false;
        }

        if (checkInOutside && typeof(checkInOutside) !== 'function') {
          console.error('`checkInOutside` should be function(node)');
          return false;
        }

        if (getRootNode && typeof(getRootNode) !== 'function') {
          console.error('`getRootNode` should be function(this)');
          return false;
        }

        return true;
      };

      setBlurListener = (callbackOrOptions, once = undefined) => {
        debugLog('setBlurListener');
        this.removeFocusListener();
        this.setWorkingParams();

        if (!callbackOrOptions || !['function', 'object'].includes(typeof(callbackOrOptions))) {
          console.error('First param for `setBlurListener` should be callback function or object of options');
          return false;
        }
        const options = this.prepareOptions(callbackOrOptions, once);

        if (!this.validateParams(options)) {
          return false;
        }

        this.setWorkingParams(options);
        // remove listeners that shouldn't be active
        this.removeExtraBlurListeners(this.listeners);
        this.addDocumentListeners(this.listeners);
        return true;
      };

      unsetListeners = () => {
        debugLog('unsetListeners');
        this.removeDocumentListeners(this.listeners);
        this.removeFocusListener();
      };

      addDocumentListeners = (listenersToAdd = {}) => {
        debugLog('addDocumentListeners', listenersToAdd);

        if (listenersToAdd.listenClick) document.addEventListener('mousedown', this.onDocumentClick, true);
        if (listenersToAdd.listenEsc) document.addEventListener('keydown', this.onDocumentEsc, true);
        if (listenersToAdd.listenTab) {
          document.addEventListener('keyup', this.onDocumentKeyUp, true);
          document.addEventListener('keydown', this.onDocumentKeyDown, true);
        }
      };

      removeDocumentListeners = (listenersToRemove = {}) => {
        debugLog('removeDocumentListeners', listenersToRemove);
        if (listenersToRemove.listenClick) document.removeEventListener('mousedown', this.onDocumentClick, true);
        if (listenersToRemove.listenEsc) document.removeEventListener('keydown', this.onDocumentEsc, true);
        if (listenersToRemove.listenTab) {
          document.removeEventListener('keyup', this.onDocumentKeyUp, true);
          document.removeEventListener('keydown', this.onDocumentKeyDown, true);
        }
      };

      removeExtraBlurListeners = (listeners = {}) => {
        this.removeDocumentListeners({
          listenClick: !listeners.listenClick,
          listenEsc: !listeners.listenEsc,
          listenTab: !listeners.listenTab,
        });
      };

      setToggleListener = (params) => {
        debugLog('setToggleListener');
        this.setWorkingParams();
        this.removeFocusListener();

        if (!this.validateParams(params, { onBlur: true, onFocus: true })) {
          return false;
        }
        this.setWorkingParams({ ...params, once: true });
        // remove listeners that shouldn't be active
        this.removeExtraBlurListeners(this.listeners);
        this.addFocusListener(this.getParentNode());
        return true;
      };

      addFocusListener = (node) => {
        if (this.focusNode !== node) {
          debugLog('addFocusListener', node);
          this.focusNode = node;
          node.addEventListener('focus', this.onFocus, true);
        }
      };

      removeFocusListener = () => {
        if (this.focusNode) {
          debugLog('removeFocusListener', this.focusNode);
          this.focusNode = null;
          this.focusNode.removeEventListener('focus', this.onFocus, true);
        }
      };

      onFocus = e => {
        debugLog('parent node focus', e);
        if (this.focusCallback) this.focusCallback(e);
        this.removeExtraBlurListeners(this.listeners);
        this.addDocumentListeners(this.listeners);
      };

      onDocumentClick = e => {
        debugLog('document mousedown', e);
        if (e.target === this.checkedElement) {
          debugLog('document mousedown event. Ignore because Element was checked');
        } else {
          this.checkAndBlur(e.target, e);
          this.checkedElement = e.target;
        }
      };

      onDocumentKeyDown = e => {
        debugLog('document keyDown event', e);
        if (e.target === this.checkedElement) {
          debugLog('document keyDown event. Ignore because Element was checked');
        } else {
          this.checkAndBlur(e.target, e);
          this.checkedElement = e.target;
        }
      };

      onDocumentKeyUp = e => {
        debugLog('document keyUp event', e);
        if (e.target === this.checkedElement) {
          debugLog('document keyUp event. Ignore because Element was checked');
        } else {
          if (String(e.key).toLowerCase() === 'tab' || String(e.code).toLowerCase() === 'tab' || e.keyCode === 9) {
            this.checkAndBlur(e.target, e);
            this.checkedElement = e.target;
          }
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
        debugLog('check and blur');
        if (!this.blurCallback && !this.isOnce) {
          return false;
        }
        if (this.inOutside(element)) {
          this.blur(e);
        }
      };

      blur = (e) => {
        if (this.blurCallback) {
          debugLog('blur callback');
          this.blurCallback(e);
        }
        if (this.isOnce) {
          debugLog('blur auto unset');
          this.unsetListeners();
        }
      };

      inOutside = domNode => {
        const isOutside = !this.inArea(domNode);
        return typeof(this.checkInOutside) === 'function'
          ? !!this.checkInOutside(domNode, isOutside)
          : isOutside;
      };

      inArea = domNode => {
        return isDomElementChild(this.getParentNode(), domNode);
      };

      getParentNode = () => this.getRootNode ? this.getRootNode(this) : ReactDOM.findDOMNode(this);

      render() {
        return (
          <WrappedComponent
            {...this.props}
            setBlurListener={this.setBlurListener}
            unsetBlurListener={this.unsetListeners}
            setToggleListener={this.setToggleListener}
            unsetToggleListener={this.unsetListeners}
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
