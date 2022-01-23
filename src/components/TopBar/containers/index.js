import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopBar from '../components';

class TopBarContainer extends Component {
  render () {
    return (
      <TopBar {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(TopBarContainer);
