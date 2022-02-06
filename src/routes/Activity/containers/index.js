import React, { Component } from 'react';
import { connect } from 'react-redux';
import Activity from '../components';

class ActivityContainer extends Component {
  render () {
    return (
      <Activity {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = state => {
  return {
    hsInfo: state.site.hsInfo,
    daysInfo: state.site.daysInfo
  };
};

export default connect(mapStateToProps, mapActionCreators)(ActivityContainer);
