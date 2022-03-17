import React, { Component } from 'react';
import { connect } from 'react-redux';
import ConfirmModal from '../components';

class ConfirmModalContainer extends Component {
  render () {
    return (
      <ConfirmModal {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(ConfirmModalContainer);
