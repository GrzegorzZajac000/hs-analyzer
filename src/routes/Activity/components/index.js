import React from 'react';
import '../styles/Activity.scss';
import HeliumAPI from '../../../api/HeliumAPI';
import PropTypes from 'prop-types';
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
    // Infinite scroll
    // Table

    let minTime = new Date().setDate(new Date().getDate() - 2);
    minTime = new Date(minTime).setMinutes(0);
    minTime = new Date(minTime).setSeconds(0);
    minTime = new Date(minTime).setMilliseconds(0);

    let maxTime = new Date().setHours(new Date().getHours() + 1);
    maxTime = new Date(maxTime).setMinutes(0);
    maxTime = new Date(maxTime).setSeconds(0);
    maxTime = new Date(maxTime).setMilliseconds(0);

    const config = {
      min_time: new Date(minTime).toISOString(),
      max_time: new Date(maxTime).toISOString()
    };

    HeliumAPI.getHotspotActivityAllData(this.props.hsInfo.address, () => {}, config)
      .then(res => this.setState({ ...this.state, activityData: res, loaded: true }))
      .catch(console.error);
  }

  generateActivity () {
    return this.state.activityData.map((activity, i) => {
      const timeAgo = GetTimeAgo(activity.time * 1000);
      console.log(activity);

      return (
        <React.Fragment key={i}>
          <tr className='activity-item'>
            <td className='activity-item-type'>{activity.type}</td>
            <td className='activity-item-desc'>
              <div className='activity-item-desc-title'>Title</div>
              <div className='activity-item-desc-info'>Additional info</div>
            </td>
            <td className='activity-item-block-height'>
              <div className='activity-item-block-height-header'>Block height</div>
              <div className='activity-item-block-height-content'>{activity.height}</div>
            </td>
            <td className='activity-item-time'>{timeAgo}</td>
          </tr>
          <tr className='activity-item-spacer' />
        </React.Fragment>
      );
    });
  }

  render () {
    if (!this.state.loaded) {
      return (
        <section className='activity route-section'>
          <div className='preload show-preloader'>
            <div className='preload-circle'>
              <div />
              <div />
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className='activity route-section'>
        <h2>Latest activity</h2>
        <div className='activity-list'>
          <table>
            {this.generateActivity()}
          </table>
        </div>
      </section>
    );
  }
}

Activity.propTypes = {
  hsInfo: PropTypes.object
};

export default Activity;
