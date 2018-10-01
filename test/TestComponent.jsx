import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import WithOnBlurComponent, { WithAutoOnBlurComponent } from './WithOnBlurComponent';

class TestComponent extends PureComponent {
  render() {
    const { isOnce, isAuto } = this.props;

    return (
      <div>
        <div>Example component</div>
        <div>
          <button id="button_out">Parent button</button>
        </div>
        {isAuto
          ? <WithAutoOnBlurComponent isOnce={isOnce} />
          : <WithOnBlurComponent  isOnce={isOnce} />
        }
      </div>
    );
  }
}

TestComponent.propTypes = {
  isOnce: PropTypes.bool,
  isAuto: PropTypes.bool
};

TestComponent.defaultProps = {
  isOnce: false,
  isAuto: false
};

export default TestComponent;
