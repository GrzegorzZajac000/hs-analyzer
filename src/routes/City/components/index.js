import React from 'react';
import '../styles/City.scss';
import { BaseComponent, HSName, isCurrentHS } from '../../../utilities';
import HeliumAPI from '../../../api/HeliumAPI';
import { Navigate } from 'react-router-dom';
import ExpandedComponent from './ExpandedComponent';
import DataTable from 'react-data-table-component';
import { getDistance } from 'geolib';

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
        id: 'name',
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
        selector: row => row,
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
      }
    ];
  }

  componentDidMount () {
    HeliumAPI.getHotspotForCity(this.props.hsList[this.props.currentHS].data.geocode.city_id)
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
                defaultSortFieldId='name'
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
