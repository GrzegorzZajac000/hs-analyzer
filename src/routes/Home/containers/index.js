import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from '../components';

class HomeContainer extends Component {
  render () {
    return (
      <Home {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(HomeContainer);
