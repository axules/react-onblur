"use strict";

exports.__esModule = true;
exports.consoleDebug = consoleDebug;
exports.default = void 0;
exports.isDomElementChild = isDomElementChild;
exports.withOnBlur = withOnBlur;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function consoleDebug() {
  var _console;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (_console = console).debug.apply(_console, ['react-onblur::'].concat(args));
}
/**
 * @param  {Node} parentDomNode
 * @param  {Node} domNode
 * @returns {Boolean}
 */


function isDomElementChild(parentDomNode, domNode) {
  if (!parentDomNode || !domNode) return false; // return parentDomNode == domNode || parentDomNode.contains(domNode);

  var el = domNode;

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
 * @returns {PureComponent}
 */


function withOnBlur(props) {
  if (props === void 0) {
    props = {};
  }

  var _props = props,
      _props$ifClick = _props.ifClick,
      ifClick = _props$ifClick === void 0 ? true : _props$ifClick,
      _props$ifKeyUpDown = _props.ifKeyUpDown,
      ifKeyUpDown = _props$ifKeyUpDown === void 0 ? true : _props$ifKeyUpDown,
      _props$ifEsc = _props.ifEsc,
      ifEsc = _props$ifEsc === void 0 ? true : _props$ifEsc,
      _props$autoUnset = _props.autoUnset,
      autoUnset = _props$autoUnset === void 0 ? false : _props$autoUnset,
      _props$debug = _props.debug,
      debug = _props$debug === void 0 ? false : _props$debug;
  var _props2 = props,
      _props2$listenClick = _props2.listenClick,
      listenClick = _props2$listenClick === void 0 ? ifClick : _props2$listenClick,
      _props2$listenTab = _props2.listenTab,
      listenTab = _props2$listenTab === void 0 ? ifKeyUpDown : _props2$listenTab,
      _props2$listenEsc = _props2.listenEsc,
      listenEsc = _props2$listenEsc === void 0 ? ifEsc : _props2$listenEsc;
  var debugLog = debug ? consoleDebug : function () {
    return undefined;
  };
  return function (WrappedComponent) {
    if (!(listenClick || listenTab || listenEsc)) return WrappedComponent;

    var WithOnBlur = /*#__PURE__*/function (_PureComponent) {
      _inheritsLoose(WithOnBlur, _PureComponent);

      function WithOnBlur() {
        var _this;

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        _this = _PureComponent.call.apply(_PureComponent, [this].concat(args)) || this;

        _this.prepareOptions = function (callbackOrOptions, once) {
          var _once;

          if (once === void 0) {
            once = undefined;
          }

          return typeof callbackOrOptions === 'function' ? {
            onBlur: callbackOrOptions,
            once: once
          } : Object.assign({}, callbackOrOptions, {
            once: !!((_once = once) != null ? _once : callbackOrOptions.once)
          });
        };

        _this.setWorkingParams = function (params) {
          _this.blurCallback = undefined;
          _this.focusCallback = undefined;
          _this.focusNode = undefined;
          _this.checkInOutside = undefined;
          _this.getRootNode = undefined;
          _this.isOnce = autoUnset;
          _this.checkedElement = Date.now();
          _this.listeners = {
            listenClick: listenClick,
            listenTab: listenTab,
            listenEsc: listenEsc
          };

          if (params) {
            var _params$once, _params$listenClick, _params$listenTab, _params$listenEsc;

            _this.blurCallback = params.onBlur;
            _this.focusCallback = params.onFocus; // this.focusNode = undefined;

            _this.checkInOutside = params.checkInOutside;
            _this.getRootNode = params.getRootNode;
            _this.isOnce = (_params$once = params.once) != null ? _params$once : autoUnset;
            _this.listeners = {
              listenClick: (_params$listenClick = params.listenClick) != null ? _params$listenClick : listenClick,
              listenTab: (_params$listenTab = params.listenTab) != null ? _params$listenTab : listenTab,
              listenEsc: (_params$listenEsc = params.listenEsc) != null ? _params$listenEsc : listenEsc
            };
          }
        };

        _this.validateParams = function (params, requiredParams) {
          if (requiredParams === void 0) {
            requiredParams = {
              onBlur: true,
              onFocus: false,
              checkInOutside: false,
              getRootNode: false,
              once: false
            };
          }

          var required = Object.entries(requiredParams).filter(function (_ref) {
            var v = _ref[1];
            return v;
          }).map(function (_ref2) {
            var k = _ref2[0];
            return k;
          });

          for (var i = 0; i < required.length; i += 1) {
            var k = required[i];

            if (!params[k]) {
              console.error("'" + k + "' is required");
              return false;
            }
          }

          var onBlur = params.onBlur,
              onFocus = params.onFocus,
              checkInOutside = params.checkInOutside,
              getRootNode = params.getRootNode;

          if (onBlur && typeof onBlur !== 'function') {
            console.error('`onBlur` should be callback function');
            return false;
          }

          if (onFocus && typeof onFocus !== 'function') {
            console.error('`onFocus` should be callback function');
            return false;
          }

          if (checkInOutside && typeof checkInOutside !== 'function') {
            console.error('`checkInOutside` should be function(node)');
            return false;
          }

          if (getRootNode && typeof getRootNode !== 'function') {
            console.error('`getRootNode` should be function(this)');
            return false;
          }

          return true;
        };

        _this.setBlurListener = function (callbackOrOptions, once) {
          if (once === void 0) {
            once = undefined;
          }

          debugLog('setBlurListener');

          _this.removeFocusListener();

          _this.setWorkingParams();

          if (!callbackOrOptions || !['function', 'object'].includes(typeof callbackOrOptions)) {
            console.error('First param for `setBlurListener` should be callback function or object of options');
            return false;
          }

          var options = _this.prepareOptions(callbackOrOptions, once);

          if (!_this.validateParams(options)) {
            return false;
          }

          _this.setWorkingParams(options); // remove listeners that shouldn't be active


          _this.removeExtraBlurListeners(_this.listeners);

          _this.addDocumentListeners(_this.listeners);

          return true;
        };

        _this.unsetBlurToggleListener = function () {
          debugLog('unsetBlurToggleListener');

          _this.removeDocumentListeners(_this.listeners);

          _this.removeFocusListener();
        };

        _this.addDocumentListeners = function (listenersToAdd) {
          if (listenersToAdd === void 0) {
            listenersToAdd = {};
          }

          debugLog('addDocumentListeners', listenersToAdd);
          if (listenersToAdd.listenClick) document.addEventListener('mousedown', _this.onDocumentClick, true);
          if (listenersToAdd.listenEsc) document.addEventListener('keydown', _this.onDocumentEsc, true);

          if (listenersToAdd.listenTab) {
            document.addEventListener('keyup', _this.onDocumentKeyUp, true);
            document.addEventListener('keydown', _this.onDocumentKeyDown, true);
          }
        };

        _this.removeDocumentListeners = function (listenersToRemove) {
          if (listenersToRemove === void 0) {
            listenersToRemove = {};
          }

          debugLog('removeDocumentListeners', listenersToRemove);
          if (listenersToRemove.listenClick) document.removeEventListener('mousedown', _this.onDocumentClick, true);
          if (listenersToRemove.listenEsc) document.removeEventListener('keydown', _this.onDocumentEsc, true);

          if (listenersToRemove.listenTab) {
            document.removeEventListener('keyup', _this.onDocumentKeyUp, true);
            document.removeEventListener('keydown', _this.onDocumentKeyDown, true);
          }
        };

        _this.removeExtraBlurListeners = function (listeners) {
          if (listeners === void 0) {
            listeners = {};
          }

          _this.removeDocumentListeners({
            listenClick: !listeners.listenClick,
            listenEsc: !listeners.listenEsc,
            listenTab: !listeners.listenTab
          });
        };

        _this.setToggleListener = function (params) {
          debugLog('setToggleListener');

          _this.setWorkingParams();

          _this.removeFocusListener();

          if (!_this.validateParams(params, {
            onBlur: true,
            onFocus: true
          })) {
            return false;
          }

          _this.setWorkingParams(Object.assign({}, params, {
            once: true
          })); // remove listeners that shouldn't be active


          _this.removeExtraBlurListeners(_this.listeners);

          _this.addFocusListener(_this.getParentNode());

          return true;
        };

        _this.addFocusListener = function (node) {
          if (_this.focusNode !== node) {
            debugLog('addFocusListener', node);
            _this.focusNode = node;
            node.addEventListener('focus', _this.onFocus, true);
          }
        };

        _this.removeFocusListener = function () {
          if (_this.focusNode) {
            debugLog('removeFocusListener', _this.focusNode);
            _this.focusNode = null;

            _this.focusNode.removeEventListener('focus', _this.onFocus, true);
          }
        };

        _this.onFocus = function (e) {
          debugLog('parent node focus', e);
          if (_this.focusCallback) _this.focusCallback(e);

          _this.removeExtraBlurListeners(_this.listeners);

          _this.addDocumentListeners(_this.listeners);
        };

        _this.onDocumentClick = function (e) {
          debugLog('document mousedown', e);

          if (e.target === _this.checkedElement) {
            debugLog('document mousedown event. Ignore because Element was checked');
          } else {
            _this.checkAndBlur(e.target, e);

            _this.checkedElement = e.target;
          }
        };

        _this.onDocumentKeyDown = function (e) {
          debugLog('document keyDown event', e);

          if (e.target === _this.checkedElement) {
            debugLog('document keyDown event. Ignore because Element was checked');
          } else {
            _this.checkAndBlur(e.target, e);

            _this.checkedElement = e.target;
          }
        };

        _this.onDocumentKeyUp = function (e) {
          debugLog('document keyUp event', e);

          if (e.target === _this.checkedElement) {
            debugLog('document keyUp event. Ignore because Element was checked');
          } else {
            if (String(e.key).toLowerCase() === 'tab' || String(e.code).toLowerCase() === 'tab' || e.keyCode === 9) {
              _this.checkAndBlur(e.target, e);

              _this.checkedElement = e.target;
            }
          }
        };

        _this.onDocumentEsc = function (e) {
          if (String(e.key).toLowerCase() === 'escape' || String(e.code).toLowerCase() === 'escape' || e.keyCode === 27) {
            debugLog('document ESC event', e);

            _this.blur(e);

            _this.checkedElement = e.target;
          }
        };

        _this.checkAndBlur = function (element, e) {
          debugLog('check and blur');

          if (!_this.blurCallback && !_this.isOnce) {
            return false;
          }

          if (_this.inOutside(element)) {
            _this.blur(e);
          }
        };

        _this.blur = function (e) {
          if (_this.blurCallback) {
            debugLog('blur callback');

            _this.blurCallback(e);
          }

          if (_this.isOnce) {
            debugLog('blur auto unset');

            _this.unsetBlurToggleListener();
          }
        };

        _this.inOutside = function (domNode) {
          var isOutside = !_this.inArea(domNode);
          return typeof _this.checkInOutside === 'function' ? !!_this.checkInOutside(domNode, isOutside) : isOutside;
        };

        _this.inArea = function (domNode) {
          return isDomElementChild(_this.getParentNode(), domNode);
        };

        _this.getParentNode = function () {
          return _this.getRootNode ? _this.getRootNode(_assertThisInitialized(_this)) : _reactDom.default.findDOMNode(_assertThisInitialized(_this));
        };

        _this.setWorkingParams();

        return _this;
      }

      var _proto = WithOnBlur.prototype;

      _proto.componentWillUnmount = function componentWillUnmount() {
        debugLog('componentWillUnmount');
        this.unsetBlurToggleListener();
      };

      _proto.render = function render() {
        return /*#__PURE__*/_react.default.createElement(WrappedComponent, _extends({}, this.props, {
          setBlurListener: this.setBlurListener,
          unsetBlurListener: this.unsetBlurToggleListener,
          setToggleListener: this.setToggleListener,
          unsetToggleListener: this.unsetBlurToggleListener
        }));
      };

      return WithOnBlur;
    }(_react.PureComponent);

    WithOnBlur.displayName = "WithOnBlur(" + (WrappedComponent.displayName || WrappedComponent.name || 'withOnBlur') + ")";
    WithOnBlur.WrappedComponent = WrappedComponent;
    return WithOnBlur;
  };
}

var _default = withOnBlur;
exports.default = _default;