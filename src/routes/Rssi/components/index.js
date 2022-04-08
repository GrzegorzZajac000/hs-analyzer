import React from 'react';
import '../styles/Rssi.scss';
import HeliumAPI from '../../../api/HeliumAPI';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { BeaconsChart, BeaconsValidChart, RSSIChart, WitnessInvalids } from '../../../components';
import { BaseComponent, generateDateConfig } from '../../../utilities';
import { Navigate } from 'react-router-dom';
import pLimit from 'p-limit';

const limit = pLimit(1);

class Rssi extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      activityData: [],
      sentBeacon: [],
      witnessedBeacon: [],
      dataLoadingLength: 0,
      earnings: [],
      config: {
        ...generateDateConfig(this.props.dateMode, this.props.minTime, this.props.maxTime),
        filter_types: 'poc_receipts_v1'
      }
    };

    this.getHSActivity = this.getHSActivity.bind(this);
    this.getEarnings = this.getEarnings.bind(this);
    this.getData = this.getData.bind(this);
    this.handleDataLoadingUpdate = this.handleDataLoadingUpdate.bind(this);
  }

  componentDidMount () {
    this.getData().then(() => {});
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.currentHS !== this.props.currentHS && this.props.currentHS === null) {
      this.updateState({ loaded: false, activityBeacon: [], witnessedBeacon: [], dataLoadingLength: 0 });
    }

    if (
      (
        prevProps.dateMode !== this.props.dateMode ||
        prevProps.minTime !== this.props.minTime ||
        prevProps.maxTime !== this.props.maxTime
      ) || (
        prevProps.currentHS !== this.props.currentHS &&
        this.props.currentHS !== null
      )
    ) {
      this.updateState({
        loaded: false,
        activityBeacon: [],
        witnessedBeacon: [],
        dataLoadingLength: 0,
        config: {
          ...generateDateConfig(this.props.dateMode, this.props.minTime, this.props.maxTime),
          filter_types: 'poc_receipts_v1'
        }
      }, () => {
        this.getData().then(() => {});
      });
    }
  }

  getData () {
    return Promise.all([
      limit(() => this.getHSActivity()),
      limit(() => this.getEarnings())
    ])
      .then(res => {
        return this.updateState({
          sentBeacon: res[0].sentBeacon,
          witnessedBeacon: res[0].witnessedBeacon,
          activityData: res[0].activityData,
          earnings: res[1],
          loaded: true
        });
      })
      .catch(err => {
        console.error(err);
        toast.error('Something went wrong with Helium API. Try one more time', { theme: 'dark' });
      });
  }

  getHSActivity () {
    return HeliumAPI.getHotspotActivity(
      this.props.hsList[this.props.currentHS].data.address,
      this.handleDataLoadingUpdate,
      this.state.config
    )
      .then(res => {
        const witnessedBeacon = [];
        const sentBeacon = [];
        const addr = this.props.hsList[this.props.currentHS].data.address;

        res.map(action => {
          try {
            if (action.path[0].challengee === addr) {
              sentBeacon.push(action);
            }
          } catch (e) {}

          try {
            const witnesses = action.path[0].witnesses;

            if (witnesses && Array.isArray(witnesses) && witnesses.length > 0) {
              witnesses.map(witness => {
                if (witness.gateway === addr) {
                  witnessedBeacon.push(action);
                }

                return witness;
              });
            }
          } catch (e) {}

          return action;
        });

        return {
          sentBeacon,
          witnessedBeacon,
          activityData: res
        };
      });
  }

  getEarnings () {
    const eConfig = this.state.config;
    delete eConfig.filter_types;

    return HeliumAPI.getRewardsForHotspot(this.props.hsList[this.props.currentHS].data.address, () => {}, eConfig).then(earnings => earnings);
  }

  handleDataLoadingUpdate (dataLoadingLength) {
    this.updateState({ dataLoadingLength });
  }

  render () {
    if (!this.state.loaded) {
      return (
        <section className='rssi route-section'>
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
      <section className='rssi route-section'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-6'>
              <WitnessInvalids sentData={this.state.sentBeacon} witnessedData={this.state.witnessedBeacon} />
            </div>
            <div className='col-6'>
              <RSSIChart data={this.state.witnessedBeacon} earnings={this.state.earnings} config={this.state.config} />
            </div>
            <div className='col-6'>
              <BeaconsChart data={this.state.sentBeacon} earnings={this.state.earnings} config={this.state.config} />
            </div>
            <div className='col-6'>
              <BeaconsValidChart data={this.state.sentBeacon} earnings={this.state.earnings} config={this.state.config} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Rssi.propTypes = {
  hsList: PropTypes.array,
  currentHS: PropTypes.number,
  dateMode: PropTypes.string,
  minTime: PropTypes.string,
  maxTime: PropTypes.string
};

export default Rssi;
