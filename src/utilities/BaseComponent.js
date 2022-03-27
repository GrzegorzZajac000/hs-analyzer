import React from 'react';

class BaseComponent extends React.Component {
  constructor (props, context) {
    super(props);

    this.props = props;
    this.context = context;
    this.unmounted = false;
  }

  componentWillUnmount () {
    this.unmounted = true;
  }

  updateState (state, callback) {
    if (!this.unmounted) {
      this.setState({
        ...this.state,
        ...state
      }, callback);
    }
  };
}

export default BaseComponent;
