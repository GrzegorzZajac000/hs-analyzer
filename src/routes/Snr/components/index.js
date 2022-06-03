import React from 'react';
import '../styles/Snr.scss';
import { BaseComponent, generateDateConfig, sendErrorToast, isCurrentHS } from '../../../utilities';
import PropTypes from 'prop-types';
import HeliumAPI from '../../../api/HeliumAPI';
import { getDistance } from 'geolib';
import DataTable from 'react-data-table-component';
import ExpandedComponent from './ExpandedComponent';
import { Navigate } from 'react-router-dom';
import { captureException } from '@sentry/react';

class Snr extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      data: [],
      dataLoadingLength: 0,
      config: {
        ...generateDateConfig(this.props.dateMode, this.props.minTime, this.props.maxTime),
        filter_types: 'poc_receipts_v1,poc_receipts_v2'
      }
    };

    this.columns = [
      {
        name: 'Address',
        selector: row => row.address
      },
      {
        name: 'Distance',
        selector: row => row,
        format: row => {
          if (!isCurrentHS(this.props.currentHS) || this.props.hsList.length <= 0 || !this.props.hsList[this.props.currentHS].data.address) {
            return '~??? km';
          }

          const distance = getDistance(
            { latitude: this.props.hsList[this.props.currentHS].data.lat, longitude: this.props.hsList[this.props.currentHS].data.lng },
            { latitude: row.lat, longitude: row.lon }
          );

          return `~${distance ? (distance / 1000).toFixed(2) : '??? '}km`;
        }
      },
      {
        id: 'amount',
        name: 'Amount',
        selector: row => row.witnesses,
        format: row => row.witnesses.length,
        sortable: true
      }
    ];

    this.getHSActivity = this.getHSActivity.bind(this);
    this.handleDataLoadingUpdate = this.handleDataLoadingUpdate.bind(this);
  }

  componentDidMount () {
    this.getHSActivity()
      .then(() => {});
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.currentHS !== this.props.currentHS && this.props.currentHS === null) {
      this.updateState({ loaded: false, data: [], dataLoadingLength: 0 });
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
        data: [],
        dataLoadingLength: 0,
        config: {
          ...generateDateConfig(this.props.dateMode, this.props.minTime, this.props.maxTime),
          filter_types: 'poc_receipts_v1, poc_receipts_v2'
        }
      }, () => {
        this.getHSActivity().then(() => {});
      });
    }
  }

  getHSActivity () {
    if (!isCurrentHS(this.props.currentHS) || this.props.hsList.length <= 0 || !this.props.hsList[this.props.currentHS].data.address) {
      return null;
    }

    return HeliumAPI.getHotspotChallenges(
      this.props.hsList[this.props.currentHS].data.address,
      this.handleDataLoadingUpdate,
      this.state.config
    ).then(res => {
      if (!isCurrentHS(this.props.currentHS) || this.props.hsList.length <= 0 || !this.props.hsList[this.props.currentHS].data.address) {
        return null;
      }

      const witnessedBeacon = {};
      const addr = this.props.hsList[this.props.currentHS].data.address;

      res.map(action => {
        try {
          const witnesses = action.path[0].witnesses;

          if (witnesses && Array.isArray(witnesses) && witnesses.length > 0) {
            witnesses.map(witness => {
              if (witness.gateway === addr) {
                if (!Array.isArray(witnessedBeacon[action.path[0].challengee])) {
                  witnessedBeacon[action.path[0].challengee] = [];

                  witnessedBeacon[action.path[0].challengee].push({
                    lat: action.path[0].challengee_lat,
                    lon: action.path[0].challengee_lon
                  });
                }

                witnessedBeacon[action.path[0].challengee].push(witness);
              }

              return witness;
            });
          }
        } catch (e) {}

        return action;
      });

      return witnessedBeacon;
    }).then(wB => {
      const data = [];

      Object.keys(wB).map(key => {
        const obj = {
          address: key,
          lat: wB[key][0].lat,
          lon: wB[key][0].lon,
          witnesses: wB[key]
        };

        obj.witnesses.shift();
        data.push(obj);

        return key;
      });

      this.updateState({ data, loaded: true });
    }).catch(err => {
      console.error(err);
      captureException(err);
      sendErrorToast('Something went wrong with Helium API. Try one more time');
    });
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
      <section className='snr route-section'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <h2>SNR Data</h2>
            </div>
            <div className='col-12'>
              <DataTable
                columns={this.columns}
                data={this.state.data}
                responsive
                striped
                sortable
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                expandableRowExpanded={() => this.props.autoExpand}
                defaultSortFieldId='amount'
                defaultSortAsc={false}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Snr.propTypes = {
  hsList: PropTypes.array,
  currentHS: PropTypes.number,
  dateMode: PropTypes.string,
  minTime: PropTypes.string,
  maxTime: PropTypes.string
};

export default Snr;
