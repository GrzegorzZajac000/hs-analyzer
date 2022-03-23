import React, { Component } from 'react';
import { connect } from 'react-redux';
import BeaconsValidChart from '../components';

class BeaconsValidChartContainer extends Component {
  render () {
    return (
      <BeaconsValidChart {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(BeaconsValidChartContainer);
