import React, { Component } from 'react';
import { connect } from 'react-redux';
import Donate from '../components';

class DonateContainer extends Component {
  render () {
    return (
      <Donate {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(DonateContainer);
