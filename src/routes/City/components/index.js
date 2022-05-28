import React from 'react';
import '../styles/City.scss';
import { BaseComponent, HSName } from '../../../utilities';
import HeliumAPI from '../../../api/HeliumAPI';
import { Navigate } from 'react-router-dom';
import ExpandedComponent from '../../Snr/components/ExpandedComponent';
import DataTable from 'react-data-table-component';

class City extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      cityData: [],
      loaded: false,
      autoExpand: false
    };

    this.columns = [
      {
        name: 'Name',
        selector: row => row.name
      },
      {
        name: 'Elevation',
        selector: row => row.elevation
      },
      {
        name: 'Gain',
        selector: row => row.gain
      },
      {
        name: 'Mode',
        selector: row => row.mode
      },
      {
        name: 'Reward Scale',
        selector: row => row.rewardScale
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
        <div className='row'>
          <div className='col-12'>
            <h2>{`${this.props.hsList[this.props.currentHS].data.geocode.long_city}, ${this.props.hsList[this.props.currentHS].data.geocode.long_state}, ${this.props.hsList[this.props.currentHS].data.geocode.long_country}`}</h2>
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
              expandableRowExpanded={() => this.state.autoExpand}
              defaultSortFieldId='name'
              defaultSortAsc={false}
            />
          </div>
        </div>
      </section>
    );
  }
}

export default City;
