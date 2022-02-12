import React, { Component } from 'react';
import { connect } from 'react-redux';
import HSModal from '../components';

class HSModalContainer extends Component {
  render () {
    return (
      <HSModal {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(HSModalContainer);
