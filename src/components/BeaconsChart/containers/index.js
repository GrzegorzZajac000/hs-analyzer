import React, { Component } from 'react';
import { connect } from 'react-redux';
import BeaconsChart from '../components';

class BeaconsChartContainer extends Component {
  render () {
    return (
      <BeaconsChart {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(BeaconsChartContainer);
