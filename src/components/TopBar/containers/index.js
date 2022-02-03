import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopBar from '../components';
import { clearHsInfo } from '../../../modules/siteReducer';

class TopBarContainer extends Component {
  render () {
    return (
      <TopBar {...this.props} />
    );
  }
}

const mapActionCreators = {
  clearHsInfo
};

const mapStateToProps = state => {
  return {
    hsInfo: state.site.hsInfo
  };
};

export default connect(mapStateToProps, mapActionCreators)(TopBarContainer);
