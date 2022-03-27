import React, { Component } from 'react';
import { connect } from 'react-redux';
import Snr from '../components';

class SnrContainer extends Component {
  render () {
    return (
      <Snr {...this.props} />
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

export default connect(mapStateToProps, mapActionCreators)(SnrContainer);
