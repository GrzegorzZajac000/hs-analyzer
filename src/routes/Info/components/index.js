import React from 'react';
import '../styles/Info.scss';
import { InfoBlock } from '../../../components';
import HeliumAPI from '../../../api/HeliumAPI';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { BaseComponent } from '../../../utilities';

class Info extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  componentDidMount () {
    return Promise.all([
      HeliumAPI.getBlockchainStats()
      // HeliumAPI.getRichestAccounts(),
      // HeliumAPI.getRewardsTotal(),
      // HeliumAPI.getDCBurnsTotal()
    ]).then(res => {
      console.log(res);

      const generalInfo = {
        hotspots: {
          total: res[0].data.data.counts.hotspots,
          online: res[0].data.data.counts.hotspots_online,
          dataonly: res[0].data.data.counts.hotspots_dataonly
        },
        validators: res[0].data.data.counts.validators,
        blockHeight: res[0].data.data.counts.blocks,
        geolocation: {
          countries: res[0].data.data.counts.countries,
          cities: res[0].data.data.counts.cities
        }
      };

      return this.props.setGeneralInfo(generalInfo);
    }).then(() => {
      this.updateState({ loaded: true });
    }).catch(err => {
      console.error(err);

      toast.error('Something went wrong with Helium API. Try one more time', {
        theme: 'dark'
      });
    });
  }

  render () {
    return (
      <section className='info route-section'>
        <div className='container-fluid'>
          <div className='row'>
            <h2>Helium stats</h2>
          </div>
          <div className='row'>
            <div className='col-2'>
              <InfoBlock title='Hotspots total' number={this.props.generalInfo.hotspots.total} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Hotspots online' number={this.props.generalInfo.hotspots.online} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Hotspots dataonly' number={this.props.generalInfo.hotspots.dataonly} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Validators total' number={this.props.generalInfo.validators} />
            </div>
            <div className='col-2'>
              <InfoBlock className='decor' title='Block height' number={this.props.generalInfo.blockHeight} />
            </div>
          </div>
          <div className='row'>
            <h2>Geolocation stats</h2>
          </div>
          <div className='row'>
            <div className='col-2'>
              <InfoBlock title='Countries' number={this.props.generalInfo.geolocation.countries} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Cities' number={this.props.generalInfo.geolocation.cities} />
            </div>
          </div>

          {/*
            Richest accounts
            30 days rewards
            30 days DC Burns
           */}
        </div>
      </section>
    );
  }
}

Info.propTypes = {
  generalInfo: PropTypes.object,
  setGeneralInfo: PropTypes.func
};

export default Info;
