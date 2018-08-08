import React from 'react';
import { shallow } from 'enzyme';
import ExampleComponent from './ExampleComponent';
import './setupTests';

describe('withOnBlur', () => {
  test('should give setBlurListener and unsetBlurListener functions', () => {
    // Render a checkbox with label in the document
    const comp = shallow(<ExampleComponent />);
    
    expect(typeof(comp.prop('setBlurListener'))).toBe('function');
    expect(typeof(comp.prop('unsetBlurListener'))).toBe('function');
  });
});