import React, { Component } from 'react';
import { connect } from 'react-redux';
import Menu from '../components';

class MenuContainer extends Component {
  render () {
    return (
      <Menu {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(MenuContainer);
