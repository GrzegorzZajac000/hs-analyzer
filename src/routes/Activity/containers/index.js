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

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(ActivityContainer);
