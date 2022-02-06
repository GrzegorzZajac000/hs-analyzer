import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddressForm from '../components';
import { setHsInfo, setDaysInfo } from '../../../modules/siteReducer';

class AddressFormContainer extends Component {
  render () {
    return (
      <AddressForm {...this.props} />
    );
  }
}

const mapActionCreators = {
  setHsInfo,
  setDaysInfo
};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(AddressFormContainer);
