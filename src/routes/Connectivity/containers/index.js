import React, { Component } from 'react';
import { connect } from 'react-redux';
import Connectivity from '../components';
import { updateHS } from '../../../modules/siteReducer';

class ConnectivityContainer extends Component {
  render () {
    return (
      <Connectivity {...this.props} />
    );
  }
}

const mapActionCreators = {
  updateHS
};

const mapStateToProps = state => {
  return {
    hsList: state.site.hsList,
    currentHS: state.site.currentHS
  };
};

export default connect(mapStateToProps, mapActionCreators)(ConnectivityContainer);
