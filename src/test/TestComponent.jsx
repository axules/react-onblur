import React, { PureComponent } from 'react';
import WithOnBlurComponent from './WithOnBlurComponent';

class TestComponent extends PureComponent {
  render() {
    return (
      <div>
        <div>Example component</div>
        <div>
          <button id="button_out">Parent button</button>
        </div>
        <WithOnBlurComponent />
      </div>
    );
  }
}

export default TestComponent;
