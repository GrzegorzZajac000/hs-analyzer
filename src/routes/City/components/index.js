import React from 'react';
import '../styles/City.scss';
import { BaseComponent, HSName, isCurrentHS, sendErrorToast } from '../../../utilities';
import HeliumAPI from '../../../api/HeliumAPI';
import { Navigate } from 'react-router-dom';
import ExpandedComponent from './ExpandedComponent';
import DataTable from 'react-data-table-component';
import { getDistance } from 'geolib';
import { captureException } from '@sentry/react';
import { toast } from 'react-toastify';

class City extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      cityData: [],
      loaded: false
    };

    this.columns = [
      {
        name: 'Name',
        selector: row => row.name,
        sortable: true
      },
      {
        name: 'Elevation',
        selector: row => row.elevation,
        format: row => `${row.elevation} m`,
        sortable: true
      },
      {
        name: 'Gain',
        selector: row => row.gain,
        format: row => `${row.gain / 10} dBi`,
        sortable: true
      },
      {
        name: 'Mode',
        selector: row => row.mode,
        sortable: true
      },
      {
        name: 'Reward Scale',
        selector: row => row.rewardScale,
        sortable: true
      },
      {
        name: 'Distance',
        id: 'distance',
        selector: row => {
          if (!isCurrentHS(this.props.currentHS) || this.props.hsList.length <= 0 || !this.props.hsList[this.props.currentHS].data.address) {
            return 99999999;
          }

          const distance = getDistance(
            { latitude: this.props.hsList[this.props.currentHS].data.lat, longitude: this.props.hsList[this.props.currentHS].data.lng },
            { latitude: row.lat, longitude: row.lon }
          );

          return distance ? (distance / 1000) : 0;
        },
        format: row => {
          if (!isCurrentHS(this.props.currentHS) || this.props.hsList.length <= 0 || !this.props.hsList[this.props.currentHS].data.address) {
            return '~??? km';
          }

          const distance = getDistance(
            { latitude: this.props.hsList[this.props.currentHS].data.lat, longitude: this.props.hsList[this.props.currentHS].data.lng },
            { latitude: row.lat, longitude: row.lon }
          );

          return `~${distance ? (distance / 1000).toFixed(2) : '0 '}km`;
        }
      },
      {
        name: '',
        selector: row => row.address,
        sortable: false,
        format: row => {
          return this.checkIfHSExists(row.address)
            ? (
              <button className='btn btn-danger btn-sm' onClick={() => this.removeHS(row.address)}>
                Remove
              </button>
            )
            : (
              <button className='btn btn-decor btn-sm' onClick={() => this.addHS(row.address)}>
                Add to analysis
              </button>
            )
        }
      }
    ];

    this.getCityData = this.getCityData.bind(this);
    this.addHS = this.addHS.bind(this);
    this.removeHS = this.removeHS.bind(this);
    this.checkIfHSExists = this.checkIfHSExists.bind(this);
  }

  componentDidMount () {
    this.getCityData();
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props !== prevProps) {
      this.getCityData();
    }
  }

  getCityData () {
    if (!isCurrentHS(this.props.currentHS)) {
      return;
    }

    return HeliumAPI.getHotspotForCity(this.props.hsList[this.props.currentHS].data.geocode.city_id)
      .then(res => res.map(hs => {
        return {
          address: hs.address,
          block: hs.block,
          elevation: hs.elevation,
          gain: hs.gain,
          location: `${hs.geocode.long_street}, ${hs.geocode.long_city}, ${hs.geocode.long_state}, ${hs.geocode.long_country}`,
          lat: hs.lat,
          lon: hs.lng,
          mode: hs.mode,
          name: HSName.toView(hs.name),
          owner: hs.owner,
          rewardScale: hs.reward_scale ? hs.reward_scale.toFixed(2) : 0,
          status: hs.status.online,
          timestamp_added: hs.timestamp_added
        }
      }))
      .then(cityData => this.updateState({ cityData, loaded: true }))
      .then(() => this.props.updateTopBar())
  }

  addHS (address) {
    return HeliumAPI.getHotspotForAddress(address)
      .then(res => {
        const hs = {};
        hs.value = res.data.data.address;
        hs.label = HSName.toView(res.data.data.name);
        hs.data = res.data.data;

        return this.props.addHSToList(hs);
      })
      .then(() => this.getCityData())
      .then(() => {
        toast.success('HS added to list', { theme: 'dark', autoClose: 3000 });
      })
      .catch(err => {
        console.error(err);
        captureException(err);
        sendErrorToast('Something went wrong with Helium API. Try one more time');
      });
  }

  removeHS (address) {
    const hsNo = this.props.hsList.map((hs, i) => {
      if (hs.value === address) {
        return i;
      }

      return null;
    }).filter(i => i !== null)[0];

    const hsCurr = this.props.currentHS;
    this.props.removeHSFromList(hsNo);

    if (hsCurr === hsNo) {
      if (this.props.hsList.length > 0) {
        this.props.useHS(0);
      } else {
        this.props.useHS(null);
        return false;
      }
    }

    return this.getCityData().then(() => toast.success('HS removed!', { theme: 'dark', autoClose: 3000 }));
  }

  checkIfHSExists (address) {
    return this.props.hsList.filter(hs => hs.value === address).length > 0;
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

    if (this.props.currentHS === null) {
      return <Navigate to='/' />;
    }

    return (
      <section className='city route-section'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <h2>Hotspots in {`${this.props.hsList[this.props.currentHS].data.geocode.long_city}, ${this.props.hsList[this.props.currentHS].data.geocode.long_state}, ${this.props.hsList[this.props.currentHS].data.geocode.long_country}`}</h2>
            </div>
            <div className='col-12'>
              <DataTable
                columns={this.columns}
                data={this.state.cityData}
                responsive
                striped
                sortable
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                expandableRowExpanded={() => this.props.autoExpand}
                defaultSortFieldId='distance'
                defaultSortAsc
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default City;
