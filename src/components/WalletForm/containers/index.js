import React, { Component } from 'react';
import { connect } from 'react-redux';
import WalletForm from '../components';
import { addHSToList, hideHSModal, useHS } from '../../../modules/siteReducer';

class WalletFormContainer extends Component {
  render () {
    return (
      <WalletForm {...this.props} />
    );
  }
}

const mapActionCreators = {
  addHSToList,
  hideHSModal,
  useHS
};

const mapStateToProps = state => {
  return {
    hsList: state.site.hsList
  };
};

export default connect(mapStateToProps, mapActionCreators)(WalletFormContainer);
