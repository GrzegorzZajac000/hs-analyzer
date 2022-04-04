import React, { Component } from 'react';
import { connect } from 'react-redux';
import HSInfoModal from '../components';
import { updateHS } from '../../../modules/siteReducer';

class HSInfoModalContainer extends Component {
  render () {
    return (
      <HSInfoModal {...this.props} />
    );
  }
}

const mapActionCreators = {
  updateHS
};

const mapStateToProps = state => {
  return {
    hsList: state.site.hsList,
    currentHS: state.site.currentHS
  };
};

export default connect(mapStateToProps, mapActionCreators)(HSInfoModalContainer);
