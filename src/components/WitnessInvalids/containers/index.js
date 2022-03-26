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

const mapStateToProps = state => {
  return {
    hsList: state.site.hsList,
    currentHS: state.site.currentHS
  };
};

export default connect(mapStateToProps, mapActionCreators)(WitnessInvalidsContainer);
