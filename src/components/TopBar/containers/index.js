import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopBar from '../components';
import { showHSModal, useHS, removeHSFromList } from '../../../modules/siteReducer';

class TopBarContainer extends Component {
  render () {
    return (
      <TopBar {...this.props} />
    );
  }
}

const mapActionCreators = {
  showHSModal,
  useHS,
  removeHSFromList
};

const mapStateToProps = state => {
  return {
    hsInfo: state.site.hsInfo,
    hsList: state.site.hsList,
    currentHS: state.site.currentHS
  };
};

export default connect(mapStateToProps, mapActionCreators)(TopBarContainer);
