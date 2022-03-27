import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChainVariables from '../components';

class ChainVariablesContainer extends Component {
  render () {
    return (
      <ChainVariables {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(ChainVariablesContainer);
