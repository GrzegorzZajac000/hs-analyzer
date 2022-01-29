import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfoBlock from '../components';

class InfoBlockContainer extends Component {
  render () {
    return (
      <InfoBlock {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapActionCreators)(InfoBlockContainer);
