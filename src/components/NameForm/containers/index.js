import React, { Component } from 'react';
import { connect } from 'react-redux';
import NameForm from '../components';
import { addHSToList, hideHSModal, useHS } from '../../../modules/siteReducer';

class NameFormContainer extends Component {
  render () {
    return (
      <NameForm {...this.props} />
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

export default connect(mapStateToProps, mapActionCreators)(NameFormContainer);
