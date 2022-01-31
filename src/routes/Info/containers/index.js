import React, { Component } from 'react';
import { connect } from 'react-redux';
import Info from '../components';
import { setGeneralInfo } from '../../../modules/siteReducer';

class InfoContainer extends Component {
  render () {
    return (
      <Info {...this.props} />
    );
  }
}

const mapActionCreators = {
  setGeneralInfo
};

const mapStateToProps = state => {
  return {
    generalInfo: state.site.generalInfo
  };
};

export default connect(mapStateToProps, mapActionCreators)(InfoContainer);
