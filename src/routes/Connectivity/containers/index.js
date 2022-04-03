import React, { Component } from 'react';
import { connect } from 'react-redux';
import Connectivity from '../components';

class ConnectivityContainer extends Component {
  render () {
    return (
      <Connectivity {...this.props} />
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

export default connect(mapStateToProps, mapActionCreators)(ConnectivityContainer);
