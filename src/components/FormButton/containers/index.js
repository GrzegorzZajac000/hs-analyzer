import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormButton from '../components';

class FormButtonContainer extends Component {
  render () {
    return (
      <FormButton {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(FormButtonContainer);
