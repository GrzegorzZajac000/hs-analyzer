import React from 'react';
import '../styles/Activity.scss';
import HeliumAPI from '../../../api/HeliumAPI';
import PropTypes from 'prop-types';
import DataGenerator from '../../../api/DateGenerator';

class Activity extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      activityData: []
    };
  }

  componentDidMount () {
    const config = {
      filter_types: 'poc_receipts_v1',
      min_time: null,
      max_time: null
    };

    if (this.props.daysInfo.mode === 'custom') {
      config.min_time = DataGenerator(this.props.daysInfo.custom[0], false);
      config.max_time = DataGenerator(this.props.daysInfo.custom[1], true);
    } else {
      const days = parseInt(this.props.daysInfo.mode, 10);
      config.min_time = DataGenerator(new Date().setDate(new Date().getDate() - days + 1), false);
      config.max_time = DataGenerator(new Date(), true);
    }

    HeliumAPI.getHotspotActivityAllData(this.props.hsInfo.address, () => {}, config)
      .then(res => this.setState({ ...this.state, activityData: res }))
      .catch(console.error);
  }

  render () {
    return (
      <section className='activity route-section'>
        Activity
      </section>
    );
  }
}

Activity.propTypes = {
  hsInfo: PropTypes.object,
  daysInfo: PropTypes.object
};

export default Activity;
