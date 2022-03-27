import React from 'react';
import '../styles/Snr.scss';
import { BaseComponent } from '../../../utilities';
import PropTypes from 'prop-types';
import HeliumAPI from '../../../api/HeliumAPI';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';

const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

ExpandedComponent.propTypes = {
  data: PropTypes.object
};

class Snr extends BaseComponent {
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
      data: [],
      dataLoadingLength: 0,
      config: {
        min_time: new Date(minTime).toISOString(),
        max_time: new Date(maxTime).toISOString(),
        filter_types: 'poc_receipts_v1'
      }
    };

    this.columns = [
      {
        name: 'Address',
        selector: row => row.address,
        format: row => <a href={`https://explorer.helium.com/accounts/${row.address}`} target='_blank' rel='noreferrer noopener'>{row.address}</a>
      }
    ];

    this.getHSActivity = this.getHSActivity.bind(this);
    this.handleDataLoadingUpdate = this.handleDataLoadingUpdate.bind(this);
  }

  componentDidMount () {
    this.getHSActivity()
      .then(() => {})
      .catch(err => {
        console.error(err);

        toast.error('Something went wrong with Helium API. Try one more time', {
          theme: 'dark'
        });
      });
  }

  getHSActivity () {
    return HeliumAPI.getHotspotActivity(
      this.props.hsList[this.props.currentHS].data.address,
      this.handleDataLoadingUpdate,
      this.state.config
    ).then(res => {
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

    return (
      <section className='snr route-section'>
        <DataTable
          columns={this.columns}
          data={this.state.data}
          pagination
          responsive
          striped
          expandableRows
          expandableRowsComponent={ExpandedComponent}
        />
      </section>
    );
  }
}

Snr.propTypes = {
  hsList: PropTypes.array,
  currentHS: PropTypes.number
};

export default Snr;
