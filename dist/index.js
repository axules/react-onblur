"use strict";

exports.__esModule = true;
exports.consoleDebug = consoleDebug;
exports.isDomElementChild = isDomElementChild;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  if (!parentDomNode || !domNode) return false;
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
 * @returns {HOC}
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
  var debugLog = debug ? consoleDebug : function () {};
  return function (WrappedComponent) {
    if (!(listenClick || listenTab || listenEsc)) return WrappedComponent;

    var WithOnBlur =
    /*#__PURE__*/
    function (_React$PureComponent) {
      _inheritsLoose(WithOnBlur, _React$PureComponent);

      function WithOnBlur() {
        var _this;

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        _this = _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args)) || this;

        _defineProperty(_assertThisInitialized(_this), "blurCallback", undefined);

        _defineProperty(_assertThisInitialized(_this), "checkInOutside", undefined);

        _defineProperty(_assertThisInitialized(_this), "isOnce", false);

        _defineProperty(_assertThisInitialized(_this), "checkedElement", null);

        _defineProperty(_assertThisInitialized(_this), "getOptions", function (callbackOrOptions) {
          return typeof callbackOrOptions === 'function' ? {
            onBlur: callbackOrOptions
          } : callbackOrOptions;
        });

        _defineProperty(_assertThisInitialized(_this), "setBlurListener", function (callbackOrOptions, once) {
          if (once === void 0) {
            once = false;
          }

          debugLog('setBlurListener');
          _this.checkedElement = null;
          _this.blurCallback = null;

          if (!callbackOrOptions || !['function', 'object'].includes(typeof callbackOrOptions)) {
            console.error('First param for `setBlurListener` should be callback function or object of options');
            return false;
          }

          var options = _this.getOptions(callbackOrOptions);

          if (typeof options.onBlur !== 'function') {
            console.error('`onBlur` should be callback function');
            return false;
          }

          _this.blurCallback = options.onBlur;
          _this.checkInOutside = options.checkInOutside;
          _this.isOnce = !!(once || options.once);
          if (listenClick) document.addEventListener('mousedown', _this.onDocumentClick, true);
          if (listenEsc) document.addEventListener('keydown', _this.onDocumentEsc, true);

          if (listenTab) {
            document.addEventListener('keyup', _this.onDocumentKeyUp, true);
            document.addEventListener('keydown', _this.onDocumentKeyDown, true);
          }

          return true;
        });

        _defineProperty(_assertThisInitialized(_this), "unsetBlurListener", function () {
          debugLog('unsetBlurListener');
          if (listenClick) document.removeEventListener('mousedown', _this.onDocumentClick, true);
          if (listenEsc) document.removeEventListener('keydown', _this.onDocumentEsc, true);

          if (listenTab) {
            document.removeEventListener('keyup', _this.onDocumentKeyUp, true);
            document.removeEventListener('keydown', _this.onDocumentKeyDown, true);
          }
        });

        _defineProperty(_assertThisInitialized(_this), "onDocumentClick", function (e) {
          debugLog('document mousedown', e);

          if (e.target !== _this.checkedElement) {
            _this.checkAndBlur(e.target, e);

            _this.checkedElement = e.target;
          } else {
            debugLog('document mousedown event. Ignore because Element was checked');
          }
        });

        _defineProperty(_assertThisInitialized(_this), "onDocumentKeyDown", function (e) {
          debugLog('document keyDown event', e);

          if (e.target !== _this.checkedElement) {
            _this.checkAndBlur(e.target, e);

            _this.checkedElement = e.target;
          } else {
            debugLog('document keyDown event. Ignore because Element was checked');
          }
        });

        _defineProperty(_assertThisInitialized(_this), "onDocumentKeyUp", function (e) {
          debugLog('document keyUp event', e);

          if (e.target !== _this.checkedElement) {
            if (String(e.key).toLowerCase() === 'tab' || String(e.code).toLowerCase() === 'tab' || e.keyCode === 9) {
              _this.checkAndBlur(e.target, e);

              _this.checkedElement = e.target;
            }
          } else {
            debugLog('document keyUp event. Ignore because Element was checked');
          }
        });

        _defineProperty(_assertThisInitialized(_this), "onDocumentEsc", function (e) {
          if (String(e.key).toLowerCase() === 'escape' || String(e.code).toLowerCase() === 'escape' || e.keyCode === 27) {
            debugLog('document ESC event', e);

            _this.blur(e);

            _this.checkedElement = e.target;
          }
        });

        _defineProperty(_assertThisInitialized(_this), "checkAndBlur", function (element, e) {
          var shouldUnset = autoUnset || _this.isOnce;
          debugLog('check and blur');
          if (!_this.blurCallback && !shouldUnset) return false;

          if (_this.inOutside(element)) {
            _this.blur(e);
          }
        });

        _defineProperty(_assertThisInitialized(_this), "blur", function (e) {
          var shouldUnset = autoUnset || _this.isOnce;

          if (_this.blurCallback) {
            debugLog('blur callback');

            _this.blurCallback(e);
          }

          if (shouldUnset) {
            debugLog('blur auto unset');

            _this.unsetBlurListener();
          }
        });

        _defineProperty(_assertThisInitialized(_this), "inOutside", function (domNode) {
          var isOutside = !_this.inArea(domNode);
          return typeof _this.checkInOutside === 'function' ? !!_this.checkInOutside(domNode, isOutside) : isOutside;
        });

        _defineProperty(_assertThisInitialized(_this), "inArea", function (domNode) {
          var parentNode = _reactDom.default.findDOMNode(_assertThisInitialized(_this));

          return isDomElementChild(parentNode, domNode);
        });

        return _this;
      }

      var _proto = WithOnBlur.prototype;

      _proto.componentWillUnmount = function componentWillUnmount() {
        this.unsetBlurListener();
      };

      _proto.render = function render() {
        return _react.default.createElement(WrappedComponent, _extends({}, this.props, {
          setBlurListener: this.setBlurListener,
          unsetBlurListener: this.unsetBlurListener
        }));
      };

      return WithOnBlur;
    }(_react.default.PureComponent);

    WithOnBlur.displayName = "WithOnBlur(" + (WrappedComponent.displayName || WrappedComponent.name || 'withOnBlur') + ")";
    WithOnBlur.WrappedComponent = WrappedComponent;
    return WithOnBlur;
  };
}

var _default = withOnBlur;
exports.default = _default;