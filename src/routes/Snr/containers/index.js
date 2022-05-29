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
    currentHS: state.site.currentHS,
    dateMode: state.site.dateMode,
    minTime: state.site.minTime,
    maxTime: state.site.maxTime,
    autoExpand: state.site.autoExpand
  };
};

export default connect(mapStateToProps, mapActionCreators)(SnrContainer);
