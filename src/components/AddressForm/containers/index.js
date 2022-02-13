import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddressForm from '../components';
import { setHsInfo } from '../../../modules/siteReducer';

class AddressFormContainer extends Component {
  render () {
    return (
      <AddressForm {...this.props} />
    );
  }
}

const mapActionCreators = {
  setHsInfo
};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(AddressFormContainer);
