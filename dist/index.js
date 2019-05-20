'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.consoleDebug = consoleDebug;
exports.isDomElementChild = isDomElementChild;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function consoleDebug() {
  var _console;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
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
function withOnBlur() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _props$ifClick = props.ifClick,
      ifClick = _props$ifClick === undefined ? true : _props$ifClick,
      _props$ifKeyUpDown = props.ifKeyUpDown,
      ifKeyUpDown = _props$ifKeyUpDown === undefined ? true : _props$ifKeyUpDown,
      _props$ifEsc = props.ifEsc,
      ifEsc = _props$ifEsc === undefined ? true : _props$ifEsc,
      _props$autoUnset = props.autoUnset,
      autoUnset = _props$autoUnset === undefined ? false : _props$autoUnset,
      _props$debug = props.debug,
      debug = _props$debug === undefined ? false : _props$debug;
  var _props$listenClick = props.listenClick,
      listenClick = _props$listenClick === undefined ? ifClick : _props$listenClick,
      _props$listenTab = props.listenTab,
      listenTab = _props$listenTab === undefined ? ifKeyUpDown : _props$listenTab,
      _props$listenEsc = props.listenEsc,
      listenEsc = _props$listenEsc === undefined ? ifEsc : _props$listenEsc;


  var debugLog = debug ? consoleDebug : function () {};

  return function (WrappedComponent) {
    if (!(listenClick || listenTab || listenEsc)) return WrappedComponent;

    var WithOnBlur = function (_React$PureComponent) {
      _inherits(WithOnBlur, _React$PureComponent);

      function WithOnBlur() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, WithOnBlur);

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WithOnBlur.__proto__ || Object.getPrototypeOf(WithOnBlur)).call.apply(_ref, [this].concat(args))), _this), _this.blurCallback = undefined, _this.checkInOutside = undefined, _this.isOnce = false, _this.checkedElement = null, _this.getOptions = function (callbackOrOptions) {
          return typeof callbackOrOptions === 'function' ? { onBlur: callbackOrOptions } : callbackOrOptions;
        }, _this.setBlurListener = function (callbackOrOptions) {
          var once = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

          debugLog('setBlurListener');
          _this.checkedElement = null;
          _this.blurCallback = null;

          if (!callbackOrOptions || !['function', 'object'].includes(typeof callbackOrOptions === 'undefined' ? 'undefined' : _typeof(callbackOrOptions))) {
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
        }, _this.unsetBlurListener = function () {
          debugLog('unsetBlurListener');
          if (listenClick) document.removeEventListener('mousedown', _this.onDocumentClick, true);
          if (listenEsc) document.removeEventListener('keydown', _this.onDocumentEsc, true);
          if (listenTab) {
            document.removeEventListener('keyup', _this.onDocumentKeyUp, true);
            document.removeEventListener('keydown', _this.onDocumentKeyDown, true);
          }
        }, _this.onDocumentClick = function (e) {
          debugLog('document mousedown', e);
          if (e.target !== _this.checkedElement) {
            _this.checkAndBlur(e.target, e);
            _this.checkedElement = e.target;
          } else {
            debugLog('document mousedown event. Ignore because Element was checked');
          }
        }, _this.onDocumentKeyDown = function (e) {
          debugLog('document keyDown event', e);
          if (e.target !== _this.checkedElement) {
            _this.checkAndBlur(e.target, e);
            _this.checkedElement = e.target;
          } else {
            debugLog('document keyDown event. Ignore because Element was checked');
          }
        }, _this.onDocumentKeyUp = function (e) {
          debugLog('document keyUp event', e);
          if (e.target !== _this.checkedElement) {
            if (String(e.key).toLowerCase() === 'tab' || String(e.code).toLowerCase() === 'tab' || e.keyCode === 9) {
              _this.checkAndBlur(e.target, e);
              _this.checkedElement = e.target;
            }
          } else {
            debugLog('document keyUp event. Ignore because Element was checked');
          }
        }, _this.onDocumentEsc = function (e) {
          if (String(e.key).toLowerCase() === 'escape' || String(e.code).toLowerCase() === 'escape' || e.keyCode === 27) {
            debugLog('document ESC event', e);
            _this.blur(e);
            _this.checkedElement = e.target;
          }
        }, _this.checkAndBlur = function (element, e) {
          var shouldUnset = autoUnset || _this.isOnce;

          debugLog('check and blur');
          if (!_this.blurCallback && !shouldUnset) return false;
          if (_this.inOutside(element)) {
            _this.blur(e);
          }
        }, _this.blur = function (e) {
          var shouldUnset = autoUnset || _this.isOnce;

          if (_this.blurCallback) {
            debugLog('blur callback');
            _this.blurCallback(e);
          }
          if (shouldUnset) {
            debugLog('blur auto unset');
            _this.unsetBlurListener();
          }
        }, _this.inOutside = function (domNode) {
          var isOutside = !_this.inArea(domNode);
          return typeof _this.checkInOutside === 'function' ? !!_this.checkInOutside(domNode, isOutside) : isOutside;
        }, _this.inArea = function (domNode) {
          var parentNode = _reactDom2.default.findDOMNode(_this);
          return isDomElementChild(parentNode, domNode);
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      _createClass(WithOnBlur, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.unsetBlurListener();
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(WrappedComponent, _extends({}, this.props, {
            setBlurListener: this.setBlurListener,
            unsetBlurListener: this.unsetBlurListener
          }));
        }
      }]);

      return WithOnBlur;
    }(_react2.default.PureComponent);

    WithOnBlur.displayName = 'WithOnBlur(' + (WrappedComponent.displayName || WrappedComponent.name || 'withOnBlur') + ')';
    WithOnBlur.WrappedComponent = WrappedComponent;

    return WithOnBlur;
  };
}

exports.default = withOnBlur;