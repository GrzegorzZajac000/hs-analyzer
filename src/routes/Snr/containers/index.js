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

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(SnrContainer);
