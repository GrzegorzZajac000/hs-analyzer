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

const mapStateToProps = state => {
  return {
    hsList: state.site.hsList,
    currentHS: state.site.currentHS,
    dateMode: state.site.dateMode,
    minTime: state.site.minTime,
    maxTime: state.site.maxTime
  };
};

export default connect(mapStateToProps, mapActionCreators)(RssiContainer);
