import React from 'react';
import { create } from 'react-test-renderer';
import TestComponent from './TestComponent';
import
WithOnBlurComponent,
{ WithAutoOnBlurComponent, WithoutEventsOnBlurComponent, WithOnBlurComponent as RootCmp }
  from './WithOnBlurComponent';
import './setupTests';

describe('withOnBlur', () => {
  beforeAll(() => {
    document.addEventListener = jest.fn();
    document.removeEventListener = jest.fn();
  });

  beforeEach(() => {
    document.addEventListener.mockClear();
    document.removeEventListener.mockClear();
  });

  test('should override passed setBlurListener, unsetBlurListener, setToggleListener functions', () => {
    const comp = create(
      <WithOnBlurComponent setBlurListener={10} unsetBlurListener={11} setToggleListener={12} />
    ).root.findByType(RootCmp);
    expect(typeof(comp.props.setBlurListener)).toBe('function');
    expect(typeof(comp.props.unsetBlurListener)).toBe('function');
    expect(typeof(comp.props.setToggleListener)).toBe('function');
  });

  test('should give custom props', () => {
    const render = create(<WithOnBlurComponent myProp={10} />);
    const comp = render.root.findByType(RootCmp);
    const wrapper = render.root.findByType(WithOnBlurComponent);
    expect(comp.props.myProp).toBe(10);
    expect(wrapper.props.myProp).toBe(10);
  });

  describe('mount TestComponent', () => {
    let render = null;
    let onBlurWrapper = null;
    let wrappedComponent = null;
    let targetInside = null;

    beforeEach(() => {
      render = create(<TestComponent />);
      onBlurWrapper = render.root.findByType(WithOnBlurComponent);
      wrappedComponent = render.root.findByType(RootCmp);
      targetInside = {
        parentNode: { parentNode: onBlurWrapper.instance.getParentNode() },
      };
      global.console.error = jest.fn();
    });

    afterEach(() => {
      render.unmount();
    });

    test('should give setBlurListener, unsetBlurListener, setToggleListener functions to child component', () => {
      expect(typeof(wrappedComponent.props.setBlurListener)).toBe('function');
      expect(typeof(wrappedComponent.props.unsetBlurListener)).toBe('function');
      expect(typeof(wrappedComponent.props.setToggleListener)).toBe('function');
    });

    test('default state component', () => {
      expect(wrappedComponent.instance.state.isOpened).toBe(false);
    });

    test('should add events', () => {
      wrappedComponent.findByProps({ id: 'button_open' }).props.onClick();
      expect(document.addEventListener).toHaveBeenCalledTimes(4);
      expect(document.removeEventListener).toHaveBeenCalledTimes(0);
      expect(document.addEventListener.mock.calls[0]).toEqual(['mousedown', onBlurWrapper.instance.onDocumentClick, true]);
      expect(document.addEventListener.mock.calls[1]).toEqual(['keydown', onBlurWrapper.instance.onDocumentEsc, true]);
      expect(document.addEventListener.mock.calls[2]).toEqual(['keyup', onBlurWrapper.instance.onDocumentKeyUp, true]);
      expect(document.addEventListener.mock.calls[3]).toEqual(['keydown', onBlurWrapper.instance.onDocumentKeyDown, true]);
    });

    test('should print error message to console', () => {
      const { setBlurListener } = wrappedComponent.props;
      setBlurListener();
      setBlurListener(null);
      setBlurListener(10);
      setBlurListener(123);
      expect(console.error).toHaveBeenCalledTimes(4);
      expect(console.error.mock.calls[0][0]).toBe('First param for `setBlurListener` should be callback function or object of options');
    });

    test('setBlurListener should add all events by object options', () => {
      wrappedComponent.props.setBlurListener({
        onBlur: () => {}
      });
      expect(document.addEventListener).toHaveBeenCalledTimes(4);
      expect(document.removeEventListener).toHaveBeenCalledTimes(0);
      expect(document.addEventListener.mock.calls[0]).toEqual(['mousedown', onBlurWrapper.instance.onDocumentClick, true]);
      expect(document.addEventListener.mock.calls[1]).toEqual(['keydown', onBlurWrapper.instance.onDocumentEsc, true]);
      expect(document.addEventListener.mock.calls[2]).toEqual(['keyup', onBlurWrapper.instance.onDocumentKeyUp, true]);
      expect(document.addEventListener.mock.calls[3]).toEqual(['keydown', onBlurWrapper.instance.onDocumentKeyDown, true]);
    });

    describe('setBlurListener should add selected events', () => {
      test('listenClick', () => {
        wrappedComponent.props.setBlurListener({
          onBlur: () => {},
          listenClick: true,
          listenEsc: false,
          listenTab: false,
        });
        expect(document.addEventListener).toHaveBeenCalledTimes(1);
        expect(document.addEventListener.mock.calls[0]).toEqual(['mousedown', onBlurWrapper.instance.onDocumentClick, true]);

        expect(document.removeEventListener).toHaveBeenCalledTimes(3);
        expect(document.removeEventListener.mock.calls[0]).toEqual(['keydown', onBlurWrapper.instance.onDocumentEsc, true]);
        expect(document.removeEventListener.mock.calls[1]).toEqual(['keyup', onBlurWrapper.instance.onDocumentKeyUp, true]);
        expect(document.removeEventListener.mock.calls[2]).toEqual(['keydown', onBlurWrapper.instance.onDocumentKeyDown, true]);
      });

      test('listenEsc', () => {
        wrappedComponent.props.setBlurListener({
          onBlur: () => {},
          listenClick: false,
          listenEsc: true,
          listenTab: false,
        });
        expect(document.addEventListener).toHaveBeenCalledTimes(1);
        expect(document.addEventListener.mock.calls[0]).toEqual(['keydown', onBlurWrapper.instance.onDocumentEsc, true]);

        expect(document.removeEventListener).toHaveBeenCalledTimes(3);
        expect(document.removeEventListener.mock.calls[0]).toEqual(['mousedown', onBlurWrapper.instance.onDocumentClick, true]);
        expect(document.removeEventListener.mock.calls[1]).toEqual(['keyup', onBlurWrapper.instance.onDocumentKeyUp, true]);
        expect(document.removeEventListener.mock.calls[2]).toEqual(['keydown', onBlurWrapper.instance.onDocumentKeyDown, true]);
      });

      test('listenTab', () => {
        wrappedComponent.props.setBlurListener({
          onBlur: () => {},
          listenClick: false,
          listenEsc: false,
          listenTab: true,
        });
        expect(document.addEventListener).toHaveBeenCalledTimes(2);
        expect(document.addEventListener.mock.calls[0]).toEqual(['keyup', onBlurWrapper.instance.onDocumentKeyUp, true]);
        expect(document.addEventListener.mock.calls[1]).toEqual(['keydown', onBlurWrapper.instance.onDocumentKeyDown, true]);

        expect(document.removeEventListener).toHaveBeenCalledTimes(2);
        expect(document.removeEventListener.mock.calls[0]).toEqual(['mousedown', onBlurWrapper.instance.onDocumentClick, true]);
        expect(document.removeEventListener.mock.calls[1]).toEqual(['keydown', onBlurWrapper.instance.onDocumentEsc, true]);
      });
    });

    describe('setToggleListener should print error message', () => {
      const testDataOnBlur = [
        [{}, '\'onBlur\' is required'],
        [{ onBlur: null }, '\'onBlur\' is required'],
        [{ onBlur: 999 }, '`onBlur` should be callback function']
      ].map(el => [{ onFocus: () => null, ...el[0] }].concat(el.slice(1)));

      const testDataOnFocus = [
        [{}, '\'onFocus\' is required'],
        [{ onFocus: null }, '\'onFocus\' is required'],
        [{ onFocus: 999 }, '`onFocus` should be callback function']
      ].map(el => [{ onBlur: () => null, ...el[0] }].concat(el.slice(1)));

      const testDataCheckInOutside = [
        [{ checkInOutside: 999 }, '`checkInOutside` should be function(node)']
      ].map(el => [{ onBlur: () => null, onFocus: () => null, ...el[0] }].concat(el.slice(1)));

      const testDataGetRootNode = [
        [{ getRootNode: 999 }, '`getRootNode` should be function(this)']
      ].map(el => [{ onBlur: () => null, onFocus: () => null, ...el[0] }].concat(el.slice(1)));

      const testData = [].concat(testDataOnBlur, testDataOnFocus, testDataCheckInOutside, testDataGetRootNode);

      test.each(testData)('%#. %j => %s', (props, expected) => {
        wrappedComponent.props.setToggleListener(props);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error.mock.calls[0][0]).toBe(expected);
      });
    });

    test('setBlurListener should print error message about onBlur to console', () => {
      wrappedComponent.props.setBlurListener({});
      wrappedComponent.props.setBlurListener({ onBlur: null });
      wrappedComponent.props.setBlurListener({ onBlur: 999 });
      expect(console.error).toHaveBeenCalledTimes(3);
      expect(console.error.mock.calls[0][0]).toBe('\'onBlur\' is required');
      expect(console.error.mock.calls[1][0]).toBe('\'onBlur\' is required');
      expect(console.error.mock.calls[2][0]).toBe('`onBlur` should be callback function');
    });

    test('should remove events', () => {
      wrappedComponent.findByProps({ id: 'button_open' }).props.onClick();
      document.removeEventListener.mockClear();
      wrappedComponent.props.unsetBlurListener();

      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(document.removeEventListener.mock.calls[0]).toEqual(['mousedown', onBlurWrapper.instance.onDocumentClick, true]);
      expect(document.removeEventListener.mock.calls[1]).toEqual(['keydown', onBlurWrapper.instance.onDocumentEsc, true]);
      expect(document.removeEventListener.mock.calls[2]).toEqual(['keyup', onBlurWrapper.instance.onDocumentKeyUp, true]);
      expect(document.removeEventListener.mock.calls[3]).toEqual(['keydown', onBlurWrapper.instance.onDocumentKeyDown, true]);
    });

    test('should call checkInOutside handler function', () => {
      const checkInOutside = jest.fn((el, isOutside) => isOutside);
      wrappedComponent.props.setBlurListener({
        onBlur: () => null,
        checkInOutside
      });
      const target = { name: 'mock target' };

      onBlurWrapper.instance.onDocumentClick({ target });
      expect(checkInOutside).toHaveBeenCalledTimes(1);
      expect(checkInOutside).toBeCalledWith(target, true);
    });

    test('should call onBlur after checkInOutside', () => {
      const checkInOutside = jest.fn(() => true);
      const onBlur = jest.fn();
      wrappedComponent.props.setBlurListener({
        onBlur,
        checkInOutside
      });
      const target = { name: 'mock target' };
      onBlurWrapper.instance.onDocumentClick({ target });
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('should not call onBlur after checkInOutside', () => {
      const checkInOutside = jest.fn(() => false);
      const onBlur = jest.fn();
      wrappedComponent.props.setBlurListener({
        onBlur,
        checkInOutside
      });
      const target = { name: 'mock target' };
      onBlurWrapper.instance.onDocumentClick({ target });
      expect(onBlur).toHaveBeenCalledTimes(0);
    });

    test('should remove events when unmount', () => {
      document.removeEventListener.mockClear();

      wrappedComponent.findByProps({ id: 'button_open' }).props.onClick();
      render.unmount();

      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(document.removeEventListener.mock.calls[0]).toEqual(['mousedown', onBlurWrapper.instance.onDocumentClick, true]);
      expect(document.removeEventListener.mock.calls[1]).toEqual(['keydown', onBlurWrapper.instance.onDocumentEsc, true]);
      expect(document.removeEventListener.mock.calls[2]).toEqual(['keyup', onBlurWrapper.instance.onDocumentKeyUp, true]);
      expect(document.removeEventListener.mock.calls[3]).toEqual(['keydown', onBlurWrapper.instance.onDocumentKeyDown, true]);
    });

    test('should auto remove after click outside once', () => {
      document.removeEventListener.mockClear();
      const onBlurWrapper = create(<TestComponent isOnce />).root.findByType(WithOnBlurComponent);
      const target = {};

      onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
      expect(document.removeEventListener).toHaveBeenCalledTimes(0);

      onBlurWrapper.instance.onDocumentClick({ target: target });
      // next should be ignored because checked
      onBlurWrapper.instance.onDocumentClick({ target: target });
      onBlurWrapper.instance.onDocumentClick({ target: target });
      // 4 removeEventListener because isOnce + 4 triggered by component
      expect(document.removeEventListener).toHaveBeenCalledTimes(8);
      expect(document.removeEventListener.mock.calls[4]).toEqual(['mousedown', onBlurWrapper.instance.onDocumentClick, true]);
      expect(document.removeEventListener.mock.calls[5]).toEqual(['keydown', onBlurWrapper.instance.onDocumentEsc, true]);
      expect(document.removeEventListener.mock.calls[6]).toEqual(['keyup', onBlurWrapper.instance.onDocumentKeyUp, true]);
      expect(document.removeEventListener.mock.calls[7]).toEqual(['keydown', onBlurWrapper.instance.onDocumentKeyDown, true]);
    });

    test('should auto remove after click outside always', () => {
      document.removeEventListener.mockClear();
      const onBlurWrapper = create(<TestComponent isAuto />).root.findByType(WithAutoOnBlurComponent);
      const target = {};

      onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
      onBlurWrapper.instance.onDocumentClick({ target });
      // next should be ignored because checked
      onBlurWrapper.instance.onDocumentClick({ target });
      onBlurWrapper.instance.onDocumentClick({ target });

      expect(document.removeEventListener).toHaveBeenCalledTimes(8);
      expect(document.removeEventListener.mock.calls[4]).toEqual(['mousedown', onBlurWrapper.instance.onDocumentClick, true]);
      expect(document.removeEventListener.mock.calls[5]).toEqual(['keydown', onBlurWrapper.instance.onDocumentEsc, true]);
      expect(document.removeEventListener.mock.calls[6]).toEqual(['keyup', onBlurWrapper.instance.onDocumentKeyUp, true]);
      expect(document.removeEventListener.mock.calls[7]).toEqual(['keydown', onBlurWrapper.instance.onDocumentKeyDown, true]);
    });

    test('should NOT auto remove after click outside, `once` overrides `autoUnset`', () => {
      document.removeEventListener.mockClear();
      const onBlurWrapper = create(<TestComponent isAuto isOnce={false} />).root.findByType(WithAutoOnBlurComponent);
      const target = {};

      onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
      onBlurWrapper.instance.onDocumentClick({ target });
      // next should be ignored because checked
      onBlurWrapper.instance.onDocumentClick({ target });
      onBlurWrapper.instance.onDocumentClick({ target });

      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(document.removeEventListener.mock.calls[0]).toEqual(['mousedown', onBlurWrapper.instance.onDocumentClick, true]);
      expect(document.removeEventListener.mock.calls[1]).toEqual(['keydown', onBlurWrapper.instance.onDocumentEsc, true]);
      expect(document.removeEventListener.mock.calls[2]).toEqual(['keyup', onBlurWrapper.instance.onDocumentKeyUp, true]);
      expect(document.removeEventListener.mock.calls[3]).toEqual(['keydown', onBlurWrapper.instance.onDocumentKeyDown, true]);
    });

    test('should open component', () => {
      onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
      expect(wrappedComponent.instance.state.isOpened).toBe(true);
    });

    test('should close component when clicks outside', () => {
      onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
      onBlurWrapper.instance.onDocumentClick({ target: {} });

      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(wrappedComponent.instance.state.isOpened).toBe(false);
    });

    test('should not close component when clicks inside', () => {
      onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
      onBlurWrapper.instance.onDocumentClick({ target: targetInside });

      expect(wrappedComponent.instance.state.isOpened).toBe(true);
    });

    describe('About document onDocumentKeyDown', () => {
      test('should close component when press Tab key outside', () => {
        onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
        onBlurWrapper.instance.onDocumentKeyDown({ target: {}, keyCode: 9 });

        expect(document.removeEventListener).toHaveBeenCalledTimes(4);
        expect(wrappedComponent.instance.state.isOpened).toBe(false);
      });

      test('should close component when press not Tab key outside', () => {
        onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
        onBlurWrapper.instance.onDocumentKeyDown({ target: {}, keyCode: 32 });

        expect(document.removeEventListener).toHaveBeenCalledTimes(4);
        expect(wrappedComponent.instance.state.isOpened).toBe(false);
      });

      test('should not close component when press Tab key outside', () => {
        onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
        onBlurWrapper.instance.onDocumentKeyDown({ target: targetInside, keyCode: 9 });

        expect(document.removeEventListener).toHaveBeenCalledTimes(0);
        expect(wrappedComponent.instance.state.isOpened).toBe(true);
      });

      test('should not close component when press not Tab key outside', () => {
        onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
        onBlurWrapper.instance.onDocumentKeyDown({ target: targetInside, keyCode: 32 });

        expect(document.removeEventListener).toHaveBeenCalledTimes(0);
        expect(wrappedComponent.instance.state.isOpened).toBe(true);
      });
    });

    describe('About document KeyUp', () => {
      test('should close component when up key with keyCode=9 outside', () => {
        onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
        onBlurWrapper.instance.onDocumentKeyUp({ target: {}, keyCode: 9 });

        expect(document.removeEventListener).toHaveBeenCalledTimes(4);
        expect(wrappedComponent.instance.state.isOpened).toBe(false);
      });

      test('should close component when up key with key=Tab outside', () => {
        onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
        onBlurWrapper.instance.onDocumentKeyUp({ target: {}, key: 'Tab' });

        expect(document.removeEventListener).toHaveBeenCalledTimes(4);
        expect(wrappedComponent.instance.state.isOpened).toBe(false);
      });

      test('should close component when up key with code=Tab outside', () => {
        onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
        onBlurWrapper.instance.onDocumentKeyUp({ target: {}, code: 'Tab' });

        expect(document.removeEventListener).toHaveBeenCalledTimes(4);
        expect(wrappedComponent.instance.state.isOpened).toBe(false);
      });

      test('should ignore when up not Tab key outside', () => {
        onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
        onBlurWrapper.instance.onDocumentKeyUp({ target: {}, keyCode: 32 });

        expect(document.removeEventListener).toHaveBeenCalledTimes(0);
        expect(wrappedComponent.instance.state.isOpened).toBe(true);
      });
    });

    test('should close component once key width keyCode=27 is pressed', () => {
      onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
      onBlurWrapper.instance.onDocumentEsc({ target: targetInside, keyCode: 27 });

      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(wrappedComponent.instance.state.isOpened).toBe(false);
    });

    test('should close component once key width key=Escape is pressed', () => {
      onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
      onBlurWrapper.instance.onDocumentEsc({ target: targetInside, key: 'Escape' });

      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(wrappedComponent.instance.state.isOpened).toBe(false);
    });

    test('should close component once key width code=Escape is pressed', () => {
      onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
      onBlurWrapper.instance.onDocumentEsc({ target: targetInside, code: 'Escape' });

      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(wrappedComponent.instance.state.isOpened).toBe(false);
    });

    test('should not remove only one event listener', () => {
      const onBlurWrapper = create(<TestComponent isEmpty />).root.findByType(WithoutEventsOnBlurComponent);
      onBlurWrapper.findByProps({ id: 'button_open' }).props.onClick();
      expect(document.addEventListener).toHaveBeenCalledTimes(1);
      expect(document.addEventListener.mock.calls[0]).toEqual(['keydown', onBlurWrapper.instance.onDocumentEsc, true]);

      expect(document.removeEventListener).toHaveBeenCalledTimes(3);
      expect(document.removeEventListener.mock.calls[0]).toEqual(['mousedown', onBlurWrapper.instance.onDocumentClick, true]);
      expect(document.removeEventListener.mock.calls[1]).toEqual(['keyup', onBlurWrapper.instance.onDocumentKeyUp, true]);
      expect(document.removeEventListener.mock.calls[2]).toEqual(['keydown', onBlurWrapper.instance.onDocumentKeyDown, true]);

      document.removeEventListener.mockClear();
      onBlurWrapper.instance.onDocumentClick({ target: {} });
      onBlurWrapper.instance.onDocumentKeyDown({ target: {}, keyCode: 32 });
      onBlurWrapper.instance.onDocumentKeyUp({ target: {}, keyCode: 9 });

      expect(document.removeEventListener).toHaveBeenCalledTimes(1);
      expect(document.removeEventListener.mock.calls[0]).toEqual(['keydown', onBlurWrapper.instance.onDocumentEsc, true]);
    });
  });
});