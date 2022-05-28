import React, { Component } from 'react';
import { connect } from 'react-redux';
import City from '../components';

class CityContainer extends Component {
  render () {
    return (
      <City {...this.props} />
    );
  }
}

const mapActionCreators = {};

const mapStateToProps = state => {
  return {
    hsList: state.site.hsList,
    currentHS: state.site.currentHS
  };
};

export default connect(mapStateToProps, mapActionCreators)(CityContainer);
