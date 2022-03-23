import React, { Component } from 'react';
import { connect } from 'react-redux';
import WitnessInvalids from '../components';

class WitnessInvalidsContainer extends Component {
  render () {
    return (
      <WitnessInvalids {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(WitnessInvalidsContainer);
