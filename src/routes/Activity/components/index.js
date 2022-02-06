import React from 'react';
import '../styles/Activity.scss';
import HeliumAPI from '../../../api/HeliumAPI';
import PropTypes from 'prop-types';
import DataGenerator from '../../../api/DateGenerator';
import GetTimeAgo from '../../../utilities/GetTimeAgo';

class Activity extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      activityData: []
    };
  }

  componentDidMount () {
    // @todo
    // Last 48 hours
    // Loader
    // Infinite scroll
    // Table

    const config = {
      min_time: DataGenerator(new Date(), false),
      max_time: DataGenerator(new Date(), true)
    };

    HeliumAPI.getHotspotActivityAllData(this.props.hsInfo.address, () => {}, config)
      .then(res => this.setState({ ...this.state, activityData: res }))
      .catch(console.error);
  }

  generateActivity () {
    return this.state.activityData.map((activity, i) => {
      const timeAgo = GetTimeAgo(activity.time * 1000);

      console.log(activity);

      return (
        <div className='activity-item' key={i}>
          <div className='activity-item-type'>{activity.type}</div>
          <div className='activity-item-desc'>
            <div className='activity-item-desc-title'>Title</div>
            <div className='activity-item-desc-info'>Additional info</div>
          </div>
          <div className='activity-item-block-height'>
            <div className='activity-item-block-height-header'>Block height</div>
            <div className='activity-item-block-height-content'>{activity.height}</div>
          </div>
          <div className='activity-item-time'>{timeAgo}</div>
        </div>
      );
    });
  }

  render () {
    return (
      <section className='activity route-section'>
        <h2>Latest activity</h2>
        <div className='activity-list'>
          {this.generateActivity()}
        </div>
      </section>
    );
  }
}

Activity.propTypes = {
  hsInfo: PropTypes.object
};

export default Activity;
