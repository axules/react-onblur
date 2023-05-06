import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import WithOnBlurComponent, { WithAutoOnBlurComponent, WithoutEventsOnBlurComponent } from './WithOnBlurComponent';

class TestComponent extends PureComponent {
  renderOnBlurComponent() {
    const { isOnce, isAuto, isEmpty } = this.props;

    if (isAuto) return <WithAutoOnBlurComponent isOnce={isOnce} />;
    if (isEmpty) return <WithoutEventsOnBlurComponent isOnce={isOnce} />;
    return <WithOnBlurComponent isOnce={isOnce} />;
  }

  render() {
    return (
      <div>
        <div>Example component</div>
        <div>
          <button id="button_out">Parent button</button>
        </div>

        {this.renderOnBlurComponent()}
      </div>
    );
  }
}

TestComponent.propTypes = {
  isOnce: PropTypes.bool,
  isAuto: PropTypes.bool,
  isEmpty: PropTypes.bool
};

TestComponent.defaultProps = {
  isOnce: undefined,
  isAuto: false,
  isEmpty: false
};

export default TestComponent;
