import React, { Component } from 'react';
import { connect } from 'react-redux';
import HSModal from '../components';
import { hideHSModal } from '../../../modules/siteReducer';

class HSModalContainer extends Component {
  render () {
    return (
      <HSModal {...this.props} />
    );
  }
}

const mapActionCreators = {
  hideHSModal
};

const mapStateToProps = state => {
  return {
    hsModal: state.site.hsModal
  };
};

export default connect(mapStateToProps, mapActionCreators)(HSModalContainer);
