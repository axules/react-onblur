'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  ifClick - if true, then click event for document will be added
  ifKeyDown - if true, then keydown and keyup events for document will be added
  ifEsc - if true, then when user clicks Esc key the event will be called
  autoUnset - if true, then unsetBlurListener function will be called after callback
  debug - if true, all debug messages will be printed in console
*/
function withOnBlur() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$ifClick = _ref.ifClick,
      ifClick = _ref$ifClick === undefined ? true : _ref$ifClick,
      _ref$ifKeyUpDown = _ref.ifKeyUpDown,
      ifKeyUpDown = _ref$ifKeyUpDown === undefined ? true : _ref$ifKeyUpDown,
      _ref$ifEsc = _ref.ifEsc,
      ifEsc = _ref$ifEsc === undefined ? true : _ref$ifEsc,
      _ref$autoUnset = _ref.autoUnset,
      autoUnset = _ref$autoUnset === undefined ? false : _ref$autoUnset,
      _ref$debug = _ref.debug,
      debug = _ref$debug === undefined ? false : _ref$debug;

  var debugLog = debug ? console.debug : function () {};

  return function (WrappedComponent) {
    if (!(ifClick || ifKeyUpDown || ifEsc)) return WrappedComponent;

    var WithOnBlur = function (_React$PureComponent) {
      _inherits(WithOnBlur, _React$PureComponent);

      function WithOnBlur() {
        var _ref2;

        var _temp, _this, _ret;

        _classCallCheck(this, WithOnBlur);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = WithOnBlur.__proto__ || Object.getPrototypeOf(WithOnBlur)).call.apply(_ref2, [this].concat(args))), _this), _this.blurCallback = undefined, _this.isOnce = false, _this.checkedElement = null, _this.setBlurListener = function (callback) {
          var once = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

          debugLog('react-onblur::setBlurListener');
          _this.checkedElement = null;
          _this.blurCallback = callback;
          _this.isOnce = !!once;
          if (!callback) return false;

          if (ifClick) document.addEventListener('click', _this.onDocumentClick);
          if (ifEsc) document.addEventListener('keydown', _this.onDocumentEsc);
          if (ifKeyUpDown) {
            document.addEventListener('keyup', _this.onDocumentKeyUp);
            document.addEventListener('keydown', _this.onDocumentKeyDown);
          }
          return true;
        }, _this.unsetBlurListener = function () {
          debugLog('react-onblur::unsetBlurListener');
          if (ifClick) document.removeEventListener('click', _this.onDocumentClick);
          if (ifEsc) document.removeEventListener('keydown', _this.onDocumentEsc);
          if (ifKeyUpDown) {
            document.removeEventListener('keyup', _this.onDocumentKeyUp);
            document.removeEventListener('keydown', _this.onDocumentKeyDown);
          }
        }, _this.onDocumentClick = function (e) {
          debugLog('react-onblur::document click', e);
          if (e.target !== _this.checkedElement) {
            _this.checkAndBlur(e.target, e);
            _this.checkedElement = e.target;
          }
        }, _this.onDocumentKeyDown = function (e) {
          if (e.target === _this.checkedElement) return e;

          debugLog('react-onblur::document keyDown event', e);
          _this.checkAndBlur(e.target, e);
          _this.checkedElement = e.target;
        }, _this.onDocumentKeyUp = function (e) {
          if (e.target === _this.checkedElement) return e;

          debugLog('react-onblur::document keyUp event', e);
          if (String(e.key).toLowerCase() === 'tab' || String(e.code).toLowerCase() === 'tab' || e.keyCode === 9) {
            _this.checkAndBlur(e.target, e);
            _this.checkedElement = e.target;
          }
        }, _this.onDocumentEsc = function (e) {
          if (String(e.key).toLowerCase() === 'escape' || String(e.code).toLowerCase() === 'escape' || e.keyCode === 27) {
            debugLog('react-onblur::document ESC event', e);
            _this.blur(e);
            _this.checkedElement = e.target;
          }
        }, _this.checkAndBlur = function (element, e) {
          var shouldUnset = autoUnset || _this.isOnce;

          debugLog('react-onblur::check and blur');
          if (!_this.blurCallback && !shouldUnset) return false;
          if (!_this.inArea(element)) {
            _this.blur(e);
          }
        }, _this.blur = function (e) {
          var shouldUnset = autoUnset || _this.isOnce;

          if (_this.blurCallback) {
            debugLog('react-onblur::blur callback');
            _this.blurCallback(e);
          }
          if (shouldUnset) {
            debugLog('react-onblur::blur auto unset');
            _this.unsetBlurListener();
          }
        }, _this.inArea = function (domNode) {
          var parentNode = _reactDom2.default.findDOMNode(_this);
          var el = domNode;
          while (el) {
            if (el === parentNode) return true;
            el = el.parentNode;
          }

          return false;
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

    WithOnBlur.displayName = 'WithOnBlur(' + (WrappedComponent.displayName || WrappedComponent.name || 'component') + ')';

    return WithOnBlur;
  };
}

exports.default = withOnBlur;