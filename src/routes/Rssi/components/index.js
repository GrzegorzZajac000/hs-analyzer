import React from 'react';
import '../styles/Rssi.scss';
import HeliumAPI from '../../../api/HeliumAPI';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { BeaconsChart, BeaconsValidChart, RSSIChart, WitnessInvalids } from '../../../components';

class Rssi extends React.Component {
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
      sentBeacon: [],
      witnessedBeacon: [],
      dataLoadingLength: 0,
      earnings: [],
      config: {
        min_time: new Date(minTime).toISOString(),
        max_time: new Date(maxTime).toISOString(),
        filter_types: 'poc_receipts_v1'
      }
    };

    this.getHSActivity = this.getHSActivity.bind(this);
    this.getEarnings = this.getEarnings.bind(this);
    this.handleDataLoadingUpdate = this.handleDataLoadingUpdate.bind(this);
  }

  componentDidMount () {
    Promise.all([
      this.getHSActivity(),
      this.getEarnings()
    ])
      .then(res => {
        return this.setState({
          ...this.state,
          sentBeacon: res[0].sentBeacon,
          witnessedBeacon: res[0].witnessedBeacon,
          activityData: res[0].activityData,
          earnings: res[1],
          loaded: true
        });
      })
      .catch(err => {
        console.error(err);

        toast.error('Something went wrong with Helium API. Try one more time', {
          theme: 'dark'
        });
      });
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.currentHS !== this.props.currentHS) {
      this.setState({ ...this.state, loaded: false, activityBeacon: [], witnessedBeacon: [], dataLoadingLength: 0 }, () => {
        Promise.all([
          this.getHSActivity(),
          this.getEarnings()
        ])
          .then(res => {
            return this.setState({
              ...this.state,
              sentBeacon: res[0].sentBeacon,
              witnessedBeacon: res[0].witnessedBeacon,
              activityData: res[0].activityData,
              earnings: res[1],
              loaded: true
            });
          })
          .catch(err => {
            console.error(err);

            toast.error('Something went wrong with Helium API. Try one more time', {
              theme: 'dark'
            });
          });
      });
    }
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
    this.setState({ ...this.state, dataLoadingLength });
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

    return (
      <section className='rssi route-section'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-6'>
              <WitnessInvalids data={this.state.sentBeacon} />
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
  currentHS: PropTypes.number
};

export default Rssi;
