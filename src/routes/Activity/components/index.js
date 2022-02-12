import React from 'react';
import '../styles/Activity.scss';
import HeliumAPI from '../../../api/HeliumAPI';
import PropTypes from 'prop-types';
import GetTimeAgo from '../../../utilities/GetTimeAgo';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';

class Activity extends React.Component {
  constructor (props) {
    super(props);

    let minTime = new Date().setDate(new Date().getDate() - 5);
    minTime = new Date(minTime).setMinutes(0);
    minTime = new Date(minTime).setSeconds(0);
    minTime = new Date(minTime).setMilliseconds(0);

    let maxTime = new Date().setHours(new Date().getHours() + 1);
    maxTime = new Date(maxTime).setMinutes(0);
    maxTime = new Date(maxTime).setSeconds(0);
    maxTime = new Date(maxTime).setMilliseconds(0);

    this.state = {
      loaded: false,
      activityData: [],
      config: {
        min_time: new Date(minTime).toISOString(),
        max_time: new Date(maxTime).toISOString()
      }
    };

    this.getHSActivity = this.getHSActivity.bind(this);
  }

  componentDidMount () {
    this.getHSActivity();
  }

  getHSActivity () {
    return HeliumAPI.getHotspotActivityAllData(this.props.hsInfo.address, () => {}, this.state.config)
      .then(res => {
        const arr = this.state.activityData.concat(res);
        return this.setState({ ...this.state, activityData: arr, loaded: true });
      })
      .then(() => {
        let minTime = new Date(this.state.config.min_time);
        minTime.setDate(minTime.getDate() - 3);
        minTime = new Date(minTime).setMinutes(0);
        minTime = new Date(minTime).setSeconds(0);
        minTime = new Date(minTime).setMilliseconds(0);

        const config = {
          min_time: new Date(minTime).toISOString(),
          max_time: this.state.config.min_time
        };

        console.log(config);

        this.setState({ ...this.state, config });
      })
      .catch(err => {
        console.error(err);

        toast.error('Something went wrong with Helium API. Try one more time', {
          theme: 'dark'
        });
      });
  }

  generateActivity () {
    return this.state.activityData.map((activity, i) => {
      const timeAgo = GetTimeAgo(activity.time * 1000);
      // console.log(activity);

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
      <section className='activity route-section' id='activity-infinite-scroll'>
        <h2>Latest activity</h2>
        <div className='activity-list'>
          <InfiniteScroll
            dataLength={this.state.activityData.length}
            next={this.getHSActivity}
            hasMore
            loader={<h4>Loading...</h4>}
            scrollableTarget='activity-infinite-scroll'
            scrollThreshold={0.25}
          >
            <table>
              <tbody>
                {this.generateActivity()}
              </tbody>
            </table>
          </InfiniteScroll>
        </div>
      </section>
    );
  }
}

Activity.propTypes = {
  hsInfo: PropTypes.object
};

export default Activity;
