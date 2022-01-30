import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddressForm from '../components';

class AddressFormContainer extends Component {
  render () {
    return (
      <AddressForm {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(AddressFormContainer);
