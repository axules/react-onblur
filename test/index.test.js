import React from 'react';
import { shallow, mount } from 'enzyme';
import TestComponent from './TestComponent';
import WithOnBlurComponent, { WithAutoOnBlurComponent, WithoutEventsOnBlurComponent } from './WithOnBlurComponent';
import './setupTests';

describe('withOnBlur', () => {

  beforeAll(() => {
    document.addEventListener = jest.fn();
    document.removeEventListener = jest.fn();
  });
  
  test('should give setBlurListener and unsetBlurListener functions', () => {
    const comp = shallow(<WithOnBlurComponent />);
    
    expect(typeof(comp.prop('setBlurListener'))).toBe('function');
    expect(typeof(comp.prop('unsetBlurListener'))).toBe('function');
  });

  test('should give custom props', () => {
    const comp = mount(<WithOnBlurComponent myProp={10} />);

    expect(comp.find(WithOnBlurComponent).length).toBe(1);
    expect(comp.find(WithOnBlurComponent).first().children.length).toBe(1);
    const wrappedInstance = comp.find(WithOnBlurComponent).first().childAt(0).instance();
    
    expect(wrappedInstance.props.myProp).toBe(10);
    comp.unmount();
  });

  
  describe('mount TestComponent', () => {
    let mountedComponent = null;
    let wrapper = null;
    let wrappedComponent = null;

    beforeEach(() => {
      mountedComponent = mount(<TestComponent />);
      wrapper = mountedComponent.find(WithOnBlurComponent).first();
      wrappedComponent = wrapper.childAt(0);
    });

    afterEach(() => {
      mountedComponent.unmount();
    });

    test('should give setBlurListener and unsetBlurListener functions to child component', () => {
      expect(typeof(wrappedComponent.instance().props.setBlurListener)).toBe('function');
      expect(typeof(wrappedComponent.instance().props.unsetBlurListener)).toBe('function');
    });
  
    test('default state component', () => {
      expect(wrappedComponent.instance().state.isOpened).toBe(false);
    });
  
    test('should add events', () => {
      document.addEventListener.mockClear();
      wrappedComponent.find('#button_open').simulate('click');
      expect(document.addEventListener).toHaveBeenCalledTimes(4);
      expect(document.removeEventListener).toHaveBeenCalledTimes(0);
      expect(document.addEventListener.mock.calls[0]).toEqual(['click', wrapper.instance().onDocumentClick]);
      expect(document.addEventListener.mock.calls[1]).toEqual(['keydown', wrapper.instance().onDocumentEsc]);
      expect(document.addEventListener.mock.calls[2]).toEqual(['keyup', wrapper.instance().onDocumentKeyUp]);
      expect(document.addEventListener.mock.calls[3]).toEqual(['keydown', wrapper.instance().onDocumentKeyDown]);
    });
  
    test('should remove events', () => {
      wrappedComponent.find('#button_open').simulate('click');
      document.removeEventListener.mockClear();
      wrappedComponent.instance().props.unsetBlurListener();

      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(document.removeEventListener.mock.calls[0]).toEqual(['click', wrapper.instance().onDocumentClick]);
      expect(document.removeEventListener.mock.calls[1]).toEqual(['keydown', wrapper.instance().onDocumentEsc]);
      expect(document.removeEventListener.mock.calls[2]).toEqual(['keyup', wrapper.instance().onDocumentKeyUp]);
      expect(document.removeEventListener.mock.calls[3]).toEqual(['keydown', wrapper.instance().onDocumentKeyDown]);
    });
  
    test('should remove events when unmount', () => {
      const mountedComponent = mount(<TestComponent />);
      const wrapper = mountedComponent.find(WithOnBlurComponent).first();
      const wrappedComponent = wrapper.childAt(0);
      document.removeEventListener.mockClear();

      wrappedComponent.find('#button_open').simulate('click');
      mountedComponent.unmount();

      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(document.removeEventListener.mock.calls[0]).toEqual(['click', wrapper.instance().onDocumentClick]);
      expect(document.removeEventListener.mock.calls[1]).toEqual(['keydown', wrapper.instance().onDocumentEsc]);
      expect(document.removeEventListener.mock.calls[2]).toEqual(['keyup', wrapper.instance().onDocumentKeyUp]);
      expect(document.removeEventListener.mock.calls[3]).toEqual(['keydown', wrapper.instance().onDocumentKeyDown]);
    });

    test('should auto remove after click outside once', () => {
      const mountedComponent = mount(<TestComponent isOnce />);
      const wrapper = mountedComponent.find(WithOnBlurComponent).first();
      const wrappedComponent = wrapper.childAt(0);
  
      wrappedComponent.find('#button_open').simulate('click');
      document.removeEventListener.mockClear();
      wrapper.instance().onDocumentClick({ target: mountedComponent.find('#button_out').instance() });
      wrapper.instance().onDocumentClick({ target: mountedComponent.find('#button_out').instance() });
      
      expect(document.removeEventListener).toHaveBeenCalledTimes(8);
      expect(document.removeEventListener.mock.calls[4]).toEqual(['click', wrapper.instance().onDocumentClick]);
      expect(document.removeEventListener.mock.calls[5]).toEqual(['keydown', wrapper.instance().onDocumentEsc]);
      expect(document.removeEventListener.mock.calls[6]).toEqual(['keyup', wrapper.instance().onDocumentKeyUp]);
      expect(document.removeEventListener.mock.calls[7]).toEqual(['keydown', wrapper.instance().onDocumentKeyDown]);
    });

    test('should auto remove after click outside always', () => {
      const mountedComponent = mount(<TestComponent isAuto />);
      const wrapper = mountedComponent.find(WithAutoOnBlurComponent).first();
      const wrappedComponent = wrapper.childAt(0);
  
      wrappedComponent.find('#button_open').simulate('click');
      document.removeEventListener.mockClear();
      wrapper.instance().onDocumentClick({ target: mountedComponent.find('#button_out').instance() });
      wrapper.instance().onDocumentClick({ target: mountedComponent.find('#button_out').instance() });
      
      expect(document.removeEventListener).toHaveBeenCalledTimes(8);
      expect(document.removeEventListener.mock.calls[4]).toEqual(['click', wrapper.instance().onDocumentClick]);
      expect(document.removeEventListener.mock.calls[5]).toEqual(['keydown', wrapper.instance().onDocumentEsc]);
      expect(document.removeEventListener.mock.calls[6]).toEqual(['keyup', wrapper.instance().onDocumentKeyUp]);
      expect(document.removeEventListener.mock.calls[7]).toEqual(['keydown', wrapper.instance().onDocumentKeyDown]);
    });
  
    test('should open component', () => {
      wrappedComponent.find('#button_open').simulate('click');
  
      expect(wrappedComponent.instance().state.isOpened).toBe(true);
    });
  
    test('should close component when clicks outside', () => {
      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentClick({ target: mountedComponent.find('#button_out').instance() });
  
      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(wrappedComponent.instance().state.isOpened).toBe(false);
    });
  
    test('should not close component when clicks inside', () => {
      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentClick({ target: mountedComponent.find('#button_in').instance() });
  
      expect(wrappedComponent.instance().state.isOpened).toBe(true);
    });
  
    test('should close component when press Tab key outside', () => {
      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentKeyDown({ target: mountedComponent.find('#button_out').instance(), keyCode: 9 });
  
      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(wrappedComponent.instance().state.isOpened).toBe(false);
    });

    test('should close component when press not Tab key outside', () => {
      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentKeyDown({ target: mountedComponent.find('#button_out').instance(), keyCode: 32 });
  
      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(wrappedComponent.instance().state.isOpened).toBe(false);
    });


    describe('About document KeyUp', () => {
      test('should close component when up key with keyCode=9 outside', () => {
        wrappedComponent.find('#button_open').simulate('click');
        wrapper.instance().onDocumentKeyUp({ target: mountedComponent.find('#button_out').instance(), keyCode: 9 });
    
        expect(document.removeEventListener).toHaveBeenCalledTimes(4);
        expect(wrappedComponent.instance().state.isOpened).toBe(false);
      });

      test('should close component when up key with key=Tab outside', () => {
        wrappedComponent.find('#button_open').simulate('click');
        wrapper.instance().onDocumentKeyUp({ target: mountedComponent.find('#button_out').instance(), key: 'Tab' });
    
        expect(document.removeEventListener).toHaveBeenCalledTimes(4);
        expect(wrappedComponent.instance().state.isOpened).toBe(false);
      });

      test('should close component when up key with code=Tab outside', () => {
        wrappedComponent.find('#button_open').simulate('click');
        wrapper.instance().onDocumentKeyUp({ target: mountedComponent.find('#button_out').instance(), code: 'Tab' });
    
        expect(document.removeEventListener).toHaveBeenCalledTimes(4);
        expect(wrappedComponent.instance().state.isOpened).toBe(false);
      });
  
      test('should ignore when up not Tab key outside', () => {
        wrappedComponent.find('#button_open').simulate('click');
        wrapper.instance().onDocumentKeyUp({ target: mountedComponent.find('#button_out').instance(), keyCode: 32 });
    
        expect(document.removeEventListener).toHaveBeenCalledTimes(0);
        expect(wrappedComponent.instance().state.isOpened).toBe(true);
      });
    });
    
  
    test('should not close component when press Tab key on inside element', () => {
      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentKeyDown({ target: mountedComponent.find('#button_in').instance(), keyCode: 9 });
  
      expect(wrappedComponent.instance().state.isOpened).toBe(true);
    });
  
    test('should not close component when press not Tab key on inside element', () => {
      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentKeyDown({ target: mountedComponent.find('#button_in').instance(), keyCode: 13 });
  
      expect(wrappedComponent.instance().state.isOpened).toBe(true);
    });
  
    test('should not close component when clicks inside', () => {
      wrappedComponent.find('#button_open').simulate('click');
      mountedComponent.find('#button_out').simulate('click');
  
      expect(wrappedComponent.instance().state.isOpened).toBe(true);
    });

    test('should close component once key width keyCode=27 is pressed', () => {
      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentEsc({ keyCode: 27 });
      wrapper.instance().onDocumentKeyUp({ target: mountedComponent.find('#button_out').instance(), keyCode: 9 });
  
      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(wrappedComponent.instance().state.isOpened).toBe(false);
    });

    test('should close component once key width key=Escape is pressed', () => {
      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentEsc({ target: mountedComponent.find('#button_in').instance(), key: 'Escape' });
  
      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(wrappedComponent.instance().state.isOpened).toBe(false);
    });

    test('should close component once key width code=Escape is pressed', () => {
      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentEsc({ target: mountedComponent.find('#button_in').instance(), code: 'Escape' });
  
      expect(document.removeEventListener).toHaveBeenCalledTimes(4);
      expect(wrappedComponent.instance().state.isOpened).toBe(false);
    });

    test('should not remove only one event listener', () => {
      const mountedComponent = mount(<TestComponent isEmpty />);
      const wrapper = mountedComponent.find(WithoutEventsOnBlurComponent).first();
      const wrappedComponent = wrapper.childAt(0);
      document.removeEventListener.mockClear();
      document.addEventListener.mockClear();

      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentClick({ target: mountedComponent.find('#button_out').instance() });
      wrapper.instance().onDocumentKeyDown({ target: mountedComponent.find('#button_out').instance(), keyCode: 32 });
      wrapper.instance().onDocumentKeyUp({ target: mountedComponent.find('#button_out').instance(), keyCode: 9 });
      
      expect(document.addEventListener).toHaveBeenCalledTimes(1);
      expect(document.addEventListener.mock.calls[0]).toEqual(['keydown', wrapper.instance().onDocumentEsc]);
      expect(document.removeEventListener).toHaveBeenCalledTimes(1);
      expect(document.removeEventListener.mock.calls[0]).toEqual(['keydown', wrapper.instance().onDocumentEsc]);
    });
  });  
});