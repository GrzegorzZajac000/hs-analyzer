import React, { Component } from 'react';
import { connect } from 'react-redux';
import Rssi from '../components';

class RssiContainer extends Component {
  render () {
    return (
      <Rssi {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(RssiContainer);
