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
    hsList: state.site.hsList,
    currentHS: state.site.currentHS
  };
};

export default connect(mapStateToProps, mapActionCreators)(ActivityContainer);
