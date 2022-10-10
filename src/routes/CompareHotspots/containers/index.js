import React, { Component } from 'react';
import { connect } from 'react-redux';
import CompareHotspots from '../components';

class CompareHotspotsContainer extends Component {
  render () {
    return (
      <CompareHotspots {...this.props} />
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

export default connect(mapStateToProps, mapActionCreators)(CompareHotspotsContainer);
