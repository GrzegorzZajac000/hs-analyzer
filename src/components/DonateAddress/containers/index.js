import React, { Component } from 'react';
import { connect } from 'react-redux';
import DonateAddress from '../components';

class DonateAddressContainer extends Component {
  render () {
    return (
      <DonateAddress {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(DonateAddressContainer);
