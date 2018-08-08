import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withOnBlur from './index';

class ExampleComponent extends PureComponent {
  render() {
    return (
      <div>
        Example component
      </div>
    );
  }
}

ExampleComponent.propTypes = {
};

ExampleComponent.defaultProps = {
};

export default withOnBlur()(ExampleComponent);
