import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withOnBlur from '../index';

class WithOnBlurComponent extends PureComponent {
  state = {
    isOpened: false
  };

  componentDidUpdate(prevProps, prevState) {
    const { isOpened } = this.state;
    const { setBlurListener, unsetBlurListener } = this.props;

    if (isOpened !== prevState.isOpened) {
      if (isOpened) setBlurListener(this.onBlurHandler);
      else unsetBlurListener();
    }
  }

  onBlurHandler = () => this.setState({ isOpened: false });

  onClickOpen = () => this.setState({ isOpened: true })

  render() {
    const { isOpened } = this.state;

    return (
      <div>
        <button type="button" id="button_open" onClick={this.onClickOpen}>Open</button>
        {isOpened &&
          <ul>
            <li>Row 1</li>
            <li>Row 2</li>
            <li>Row 3</li>
            <li>
              Row 4
              <button type="button" id="button_in">Button 4</button>
            </li>
          </ul>
        }
      </div>
    );
  }
}

WithOnBlurComponent.propTypes = {
  setBlurListener: PropTypes.func.isRequired,
  unsetBlurListener: PropTypes.func.isRequired
};

WithOnBlurComponent.defaultProps = {
};

export default withOnBlur()(WithOnBlurComponent);
