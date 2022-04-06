import React, { Component } from 'react';
import { connect } from 'react-redux';
import DateConfigModal from '../components';
import { setDateMode, setMinTime, setMaxTime } from '../../../modules/siteReducer';

class DateConfigModalContainer extends Component {
  render () {
    return (
      <DateConfigModal {...this.props} />
    );
  }
}

const mapActionCreators = {
  setDateMode,
  setMinTime,
  setMaxTime
};

const mapStateToProps = state => {
  return {
    dateMode: state.site.dateMode,
    minTime: state.site.minTime,
    maxTime: state.site.maxTime
  };
};

export default connect(mapStateToProps, mapActionCreators)(DateConfigModalContainer);
