import React, { Component } from 'react';
import { connect } from 'react-redux';
import NoMatch from '../components';

class NoMatchContainer extends Component {
  render () {
    return (
      <NoMatch {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(NoMatchContainer);
