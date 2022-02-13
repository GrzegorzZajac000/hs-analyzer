import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddressForm from '../components';
import { addHSToList, hideHSModal, useHS } from '../../../modules/siteReducer';

class AddressFormContainer extends Component {
  render () {
    return (
      <AddressForm {...this.props} />
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

export default connect(mapStateToProps, mapActionCreators)(AddressFormContainer);
