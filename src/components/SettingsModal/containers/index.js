import React, { Component } from 'react';
import { connect } from 'react-redux';
import Settings from '../components';
import { setAutoExpand } from '../../../modules/siteReducer';

class SettingsContainer extends Component {
  render () {
    return (
      <Settings {...this.props} />
    );
  }
}

const mapActionCreators = {
  setAutoExpand
};

const mapStateToProps = state => {
  return {
    autoExpand: state.site.autoExpand
  };
};

export default connect(mapStateToProps, mapActionCreators)(SettingsContainer);
