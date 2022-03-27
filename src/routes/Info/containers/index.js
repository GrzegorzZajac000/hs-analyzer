import React, { Component } from 'react';
import { connect } from 'react-redux';
import Info from '../components';

class InfoContainer extends Component {
  render () {
    return (
      <Info {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(InfoContainer);
