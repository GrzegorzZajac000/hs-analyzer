import React, { Component } from 'react';
import { connect } from 'react-redux';
import DayModal from '../components';

class DayModalContainer extends Component {
  render () {
    return (
      <DayModal {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(DayModalContainer);
