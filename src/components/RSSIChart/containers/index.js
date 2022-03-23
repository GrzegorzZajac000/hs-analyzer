import React, { Component } from 'react';
import { connect } from 'react-redux';
import RSSIChart from '../components';

class RSSIChartContainer extends Component {
  render () {
    return (
      <RSSIChart {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(RSSIChartContainer);
