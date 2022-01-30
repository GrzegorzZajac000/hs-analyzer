import React, { Component } from 'react';
import { connect } from 'react-redux';
import NameForm from '../components';

class NameFormContainer extends Component {
  render () {
    return (
      <NameForm {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(NameFormContainer);
