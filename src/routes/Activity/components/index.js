import React from 'react';
import '../styles/Activity.scss';
import HeliumAPI from '../../../api/HeliumAPI';
import PropTypes from 'prop-types';
import GetTimeAgo from '../../../utilities/GetTimeAgo';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import { getDistance } from 'geolib';
import { CashCoin, Eye, Send, BroadcastPin, Truck, ConeStriped } from 'react-bootstrap-icons';

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
    return HeliumAPI.getHotspotActivityAllData(this.props.hsList[this.props.currentHS].data.address, () => {}, this.state.config)
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

        this.setState({ ...this.state, config });
      })
      .catch(err => {
        console.error(err);

        toast.error('Something went wrong with Helium API. Try one more time', {
          theme: 'dark'
        });
      });
  }

  generateRewards (activity) {
    return {
      name: 'Received Mining Rewards',
      icon: <CashCoin size={18} />,
      className: 'activity-reward',
      content: activity.rewards.map((reward, i) => {
        let rewardTitle = '';

        switch (reward.type) {
        case 'poc_witnesses': { rewardTitle = 'Witnessed Beacon'; break; }
        case 'poc_challengees': { rewardTitle = 'Broadcasted Beacon'; break; }
        case 'poc_challengers': { rewardTitle = 'Challenged Beaconer'; break; }
        case 'data_credits': { rewardTitle = 'Transferred Packets'; break; }
        default: { rewardTitle = reward.type; }
        }

        return (
          <div className='activity-item-desc-block' key={i}>
            <p>{rewardTitle}</p>
            <h6>{reward.amount / 10000000} HNT</h6>
          </div>
        );
      })
    }
  }

  generateTransferPackets (activity) {
    return {
      name: 'Transferred Packets',
      icon: <Truck size={18} />,
      className: 'activity-transferred-packets',
      content: (
        <div className='activity-item-desc-block'>
          <p>{activity.state_channel.summaries[0].num_packets} packets | {activity.state_channel.summaries[0].num_dcs}DC</p>
        </div>
      )
    };
  }

  generateConstructedChallenge () {
    return {
      name: 'Constructed Challenge',
      icon: <ConeStriped size={18} />,
      className: 'activity-constructed-challenge',
      content: ''
    };
  }

  generateChallengedBeaconer () {
    return {
      name: 'Challenged Beaconer',
      icon: <Send size={18} />,
      className: 'activity-challenged-beaconer',
      content: ''
    };
  }

  generateWitnessedBeacon (activity) {
    const witnessedData = activity.path[0].witnesses.filter(item => item.gateway === this.props.hsList[this.props.currentHS].data.address);
    const distance = getDistance(
      { latitude: this.props.hsList[this.props.currentHS].data.lat, longitude: this.props.hsList[this.props.currentHS].data.lng },
      { latitude: activity.path[0].challengee_lat, longitude: activity.path[0].challengee_lon }
    );

    return {
      name: 'Witnessed Beacon',
      icon: <Eye size={18} />,
      className: 'activity-witnessed-beacon',
      content: (
        <div className='activity-item-desc-block'>
          <p>{witnessedData[0].is_valid ? 'Valid' : 'Invalid'}</p>
          <h6>~{(distance / 1000).toFixed(2)}km | TX Power: {(activity.path[0].receipt && activity.path[0].receipt.tx_power) || 'Unknown'} | {witnessedData[0].signal} dBm RSSI | {witnessedData[0].snr.toFixed(2)} db SNR</h6>
        </div>
      )
    };
  }

  generateBroadcastedBeacon (activity) {
    const valid = activity.path[0].witnesses.filter(witness => witness.is_valid);
    const invalid = activity.path[0].witnesses.length - valid.length;

    return {
      name: 'Broadcasted Beacon',
      icon: <BroadcastPin size={18} />,
      className: 'activity-broadcasted-beacon',
      content: (
        <div className='activity-item-desc-block'>
          <p>{valid.length}/{invalid}</p>
          <h6>TX Power: {(activity.path[0].receipt && activity.path[0].receipt.tx_power) || 'Unknown'}</h6>
        </div>
      )
    };
  }

  generateActivity () {
    return this.state.activityData.map((activity, i) => {
      let item = {};

      switch (activity.type) {
      case 'rewards_v2': {
        item = this.generateRewards(activity);
        break;
      }

      case 'poc_receipts_v1': {
        if (activity.path && activity.path[0] && activity.path[0].challengee && activity.path[0].challengee === this.props.hsList[this.props.currentHS].data.address) {
          item = this.generateBroadcastedBeacon(activity);
        } else if (activity.challenger && activity.challenger === this.props.hsList[this.props.currentHS].data.address) {
          item = this.generateChallengedBeaconer();
        } else {
          item = this.generateWitnessedBeacon(activity);
        }

        break;
      }

      case 'poc_request_v1': {
        item = this.generateConstructedChallenge();
        break;
      }

      case 'state_channel_close_v1': {
        item = this.generateTransferPackets(activity);
        break;
      }

      default: break;
      }

      return (
        <React.Fragment key={i}>
          <tr className={'activity-item ' + item.className}>
            <td className='activity-item-icon'>
              <div>{item.icon}</div>
            </td>
            <td className='activity-item-type'>{item.name}</td>
            <td className='activity-item-desc'>{item.content}</td>
            <td className='activity-item-block-height'>
              <div className='activity-item-block-height-header'>Block height</div>
              <div className='activity-item-block-height-content'>{activity.height}</div>
            </td>
            <td className='activity-item-time'>{GetTimeAgo(activity.time * 1000)}</td>
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
            loader={<h4 className='activity-loading'>Loading...</h4>}
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
  hsList: PropTypes.array,
  currentHS: PropTypes.number
};

export default Activity;
