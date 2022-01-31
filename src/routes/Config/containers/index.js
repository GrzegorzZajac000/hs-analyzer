import React, { Component } from 'react';
import { connect } from 'react-redux';
import Config from '../components';

class ConfigContainer extends Component {
  render () {
    return (
      <Config {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(ConfigContainer);
