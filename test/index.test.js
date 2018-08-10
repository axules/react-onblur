import React from 'react';
import { shallow, mount } from 'enzyme';
import TestComponent from './TestComponent';
import WithOnBlurComponent from './WithOnBlurComponent';
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

    beforeEach(() => {
      mountedComponent = mount(<TestComponent />);
    });

    afterEach(() => {
      mountedComponent.unmount();
    });

    test('should give setBlurListener and unsetBlurListener functions to child component', () => {
      const wrappedInstance = mountedComponent.find(WithOnBlurComponent).first().childAt(0).instance();
  
      expect(typeof(wrappedInstance.props.setBlurListener)).toBe('function');
      expect(typeof(wrappedInstance.props.unsetBlurListener)).toBe('function');
    });
  
    test('default state component', () => {
      const wrappedComponent = mountedComponent.find(WithOnBlurComponent).first().childAt(0);
  
      expect(wrappedComponent.instance().state.isOpened).toBe(false);
    });
  
    test('should add events', () => {
      const wrapper = mountedComponent.find(WithOnBlurComponent).first();
      const wrappedComponent = wrapper.childAt(0);
  
      document.addEventListener.mockClear();
      wrappedComponent.find('#button_open').simulate('click');
      expect(document.addEventListener).toHaveBeenCalledTimes(2);
      expect(document.addEventListener.mock.calls[0]).toEqual(['click', wrapper.instance().onDocumentClick]);
      expect(document.addEventListener.mock.calls[1]).toEqual(['keyup', wrapper.instance().onDocumentKeyUp]);
    });
  
    test('should remove events', () => {
      const wrapper = mountedComponent.find(WithOnBlurComponent).first();
      const wrappedComponent = wrapper.childAt(0);
  
      wrappedComponent.find('#button_open').simulate('click');
      document.removeEventListener.mockClear();
      wrappedComponent.instance().props.unsetBlurListener();
      expect(document.removeEventListener).toHaveBeenCalledTimes(2);
      expect(document.removeEventListener.mock.calls[0]).toEqual(['click', wrapper.instance().onDocumentClick]);
      expect(document.removeEventListener.mock.calls[1]).toEqual(['keyup', wrapper.instance().onDocumentKeyUp]);
    });
  
    test('should remove events when unmount', () => {
      const mountedComponent = mount(<TestComponent />);
      const wrapper = mountedComponent.find(WithOnBlurComponent).first();
      const wrappedComponent = wrapper.childAt(0);
  
      wrappedComponent.find('#button_open').simulate('click');
      document.removeEventListener.mockClear();
      mountedComponent.unmount();
      expect(document.removeEventListener).toHaveBeenCalledTimes(2);
      expect(document.removeEventListener.mock.calls[0]).toEqual(['click', wrapper.instance().onDocumentClick]);
      expect(document.removeEventListener.mock.calls[1]).toEqual(['keyup', wrapper.instance().onDocumentKeyUp]);
    });
  
    test('should open component', () => {
      const wrappedComponent = mountedComponent.find(WithOnBlurComponent).first().childAt(0);
  
      wrappedComponent.find('#button_open').simulate('click');
  
      expect(wrappedComponent.instance().state.isOpened).toBe(true);
    });
  
    test('should close component when clicks outside', () => {
      const wrapper = mountedComponent.find(WithOnBlurComponent).first();
      const wrappedComponent = wrapper.childAt(0);
  
      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentClick({ target: mountedComponent.find('#button_out').instance() });
  
      expect(wrappedComponent.instance().state.isOpened).toBe(false);
    });
  
    test('should not close component when clicks inside', () => {
      const wrapper = mountedComponent.find(WithOnBlurComponent).first();
      const wrappedComponent = wrapper.childAt(0);
  
      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentClick({ target: mountedComponent.find('#button_in').instance() });
  
      expect(wrappedComponent.instance().state.isOpened).toBe(true);
    });
  
    test('should close component when press Tab key', () => {
      const wrapper = mountedComponent.find(WithOnBlurComponent).first();
      const wrappedComponent = wrapper.childAt(0);
  
      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentKeyUp({ target: mountedComponent.find('#button_out').instance(), keyCode: 9 });
  
      expect(wrappedComponent.instance().state.isOpened).toBe(false);
    });
  
    test('should not close component when press Tab key to inside', () => {
      const wrapper = mountedComponent.find(WithOnBlurComponent).first();
      const wrappedComponent = wrapper.childAt(0);
  
      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentKeyUp({ target: mountedComponent.find('#button_in').instance(), keyCode: 9 });
  
      expect(wrappedComponent.instance().state.isOpened).toBe(true);
    });
  
    test('should not close component when press not Tab key to inside', () => {
      const wrapper = mountedComponent.find(WithOnBlurComponent).first();
      const wrappedComponent = wrapper.childAt(0);
  
      wrappedComponent.find('#button_open').simulate('click');
      wrapper.instance().onDocumentKeyUp({ target: mountedComponent.find('#button_out').instance(), keyCode: 13 });
  
      expect(wrappedComponent.instance().state.isOpened).toBe(true);
    });
  
    test('should not close component when clicks inside', () => {
      const wrappedComponent = mountedComponent.find(WithOnBlurComponent).first().childAt(0);
  
      wrappedComponent.find('#button_open').simulate('click');
      mountedComponent.find('#button_out').simulate('click');
  
      expect(wrappedComponent.instance().state.isOpened).toBe(true);
    });
  });  
});