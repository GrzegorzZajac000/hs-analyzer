import React from 'react';
import '../styles/Activity.scss';
import HeliumAPI from '../../../api/HeliumAPI';
import PropTypes from 'prop-types';
import { BaseComponent, generateDateConfig, GetTimeAgo, noExponents, sendErrorToast } from '../../../utilities';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getDistance } from 'geolib';
import { CashCoin, Eye, Send, BroadcastPin, Truck, ConeStriped, Bug } from 'react-bootstrap-icons';
import { Navigate } from 'react-router-dom';
import { captureException } from '@sentry/react';
import Select from 'react-select';

const errorActivity = {
  name: 'API Error - Empty Activity',
  icon: <Bug size={18} />,
  className: 'activity-error',
  content: ''
};

class Activity extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      activityData: [],
      dataLoadingLength: 0,
      dataFilter: { label: 'All', value: 'all' },
      config: generateDateConfig(this.props.dateMode, this.props.minTime, this.props.maxTime)
    };

    this.filters = [
      { label: 'All', value: 'all' },
      { label: 'Rewards', value: 'rewards' },
      { label: 'Packets', value: 'packets' },
      { label: 'Constructed challenge', value: 'constructed-challenge' },
      { label: 'Challenged beaconer', value: 'challenged-beaconer' },
      { label: 'Witnessed beacon', value: 'witnessed-beacon' },
      { label: 'Broadcasted beacon', value: 'broadcasted-beacon' }
    ];

    this.getHSActivity = this.getHSActivity.bind(this);
    this.handleDataLoadingUpdate = this.handleDataLoadingUpdate.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentDidMount () {
    this.getHSActivity();
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.currentHS !== this.props.currentHS && this.props.currentHS === null) {
      this.updateState({ loaded: false, activityData: [], dataLoadingLength: 0 });
    }

    if (
      (
        prevProps.dateMode !== this.props.dateMode ||
        prevProps.minTime !== this.props.minTime ||
        prevProps.maxTime !== this.props.maxTime
      ) || (
        prevProps.currentHS !== this.props.currentHS &&
        this.props.currentHS !== null
      ) || (
        prevProps.hsList.length !== this.props.hsList.length &&
        this.props.currentHS !== null
      )
    ) {
      this.updateState({
        loaded: false,
        activityData: [],
        dataLoadingLength: 0,
        config: generateDateConfig(this.props.dateMode, this.props.minTime, this.props.maxTime)
      }, () => {
        this.getHSActivity();
      });
    }
  }

  handleDataLoadingUpdate (dataLoadingLength) {
    this.updateState({ dataLoadingLength });
  }

  handleFilterChange (dataFilter) {
    this.updateState({ dataFilter });
  }

  getHSActivity () {
    return HeliumAPI.getHotspotActivity(
      this.props.hsList[this.props.currentHS].data.address,
      this.handleDataLoadingUpdate,
      this.state.config
    )
      .then(res => {
        const arr = this.state.activityData.concat(res);
        return this.updateState({ activityData: arr, loaded: true });
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

        this.updateState({ config });
      })
      .catch(err => {
        console.error(err);
        captureException(err);
        sendErrorToast('Something went wrong with Helium API. Try one more time');
      });
  }

  generateRewards (activity) {
    if (!activity) {
      return errorActivity;
    }

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
            <h6>{noExponents(reward.amount / 100000000)} HNT</h6>
          </div>
        );
      })
    }
  }

  generateTransferPackets (activity) {
    if (!activity) {
      return errorActivity;
    }

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

  generateWitnessedBeacon (activity, hs) {
    if (!activity || !hs || !hs.data || !hs.data.address) {
      return errorActivity;
    }

    const witnessedData = activity.path[0].witnesses.filter(item => item.gateway === hs.data.address);

    if (!witnessedData || witnessedData.length <= 0 || !hs.data.lat || !hs.data.lng) {
      return null;
    }

    const distance = getDistance(
      { latitude: hs.data.lat, longitude: hs.data.lng },
      { latitude: activity.path[0].challengee_lat, longitude: activity.path[0].challengee_lon }
    );

    if (!distance) {
      return null;
    }

    return {
      name: 'Witnessed Beacon',
      icon: <Eye size={18} />,
      className: 'activity-witnessed-beacon',
      content: (
        <div className='activity-item-desc-block'>
          <p>{witnessedData[0].is_valid ? 'Valid' : 'Invalid'}</p>
          <h6>~{distance ? (distance / 1000).toFixed(2) : '??? '}km | TX Power: {(activity.path[0].receipt && activity.path[0].receipt.tx_power) || 'Unknown'} | {witnessedData[0].signal} dBm RSSI | {witnessedData[0].snr ? witnessedData[0].snr.toFixed(2) : '??? '} db SNR</h6>
        </div>
      )
    };
  }

  generateBroadcastedBeacon (activity) {
    if (!activity) {
      return errorActivity;
    }

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
    if (!this.state.activityData || !Array.isArray(this.state.activityData) || this.state.activityData.length <= 0) {
      return null;
    }

    const hs = this.props.hsList[this.props.currentHS];

    return this.state.activityData.map((activity, i) => {
      let item = {};

      switch (activity.type) {
      case 'rewards_v2': {
        item = this.generateRewards(activity);
        break;
      }

      case 'poc_receipts_v1': {
        if (activity.path && activity.path[0] && activity.path[0].challengee && activity.path[0].challengee === hs.data.address) {
          item = this.generateBroadcastedBeacon(activity);
        } else if (activity.challenger && activity.challenger === hs.data.address) {
          item = this.generateChallengedBeaconer();
        } else {
          item = this.generateWitnessedBeacon(activity, hs);
        }

        break;
      }

      case 'poc_request_v1': {
        item = this.generateConstructedChallenge();
        break;
      }

      case 'state_channel_close_v1': {
        item = this.generateTransferPackets(activity, hs);
        break;
      }

      default: break;
      }

      if (!item || !activity) {
        return null;
      }

      return (
        <tr key={i} className={'activity-item ' + item.className}>
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
            <div className='preload-progress'>
              <p className='preload-progress-entries'>Loaded {this.state.dataLoadingLength} entries...</p>
              <p className='preload-progress-joke'>#justHeliumAPIThings</p>
            </div>
          </div>
        </section>
      );
    }

    if (this.props.currentHS === null) {
      return <Navigate to='/' />;
    }

    return (
      <section className='activity route-section' id='activity-infinite-scroll'>
        <h2>Latest activity</h2>
        <div className='activity-filter'>
          <label htmlFor='filter-data'>Filter:</label>
          <Select
            className='react-select'
            classNamePrefix='rs'
            options={this.filters}
            onChange={this.handleFilterChange}
            value={this.state.dataFilter}
            isSearchable={false}
          />
        </div>
        <div className={'activity-list' + (` ${this.state.dataFilter.value}`)}>
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
  currentHS: PropTypes.number,
  dateMode: PropTypes.string,
  minTime: PropTypes.string,
  maxTime: PropTypes.string
};

export default Activity;
