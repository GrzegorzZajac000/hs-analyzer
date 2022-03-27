import React from 'react';
import '../styles/Info.scss';
import { InfoBlock } from '../../../components';
import HeliumAPI from '../../../api/HeliumAPI';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { BaseComponent } from '../../../utilities';
import DataTable from 'react-data-table-component';
import NumberFormat from 'react-number-format';

class Info extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false
    };

    this.columns = [
      {
        name: 'Address',
        selector: row => row.address,
        format: row => <a href={`https://explorer.helium.com/accounts/${row.address}`} target='_blank' rel='noreferrer noopener'>{row.address}</a>
      },
      {
        name: 'Balance',
        selector: row => <NumberFormat value={row.balance} displayType='text' thousandSeparator=' ' suffix=' HNT' />,
        sortable: true
      },
      {
        name: 'Staked balance',
        selector: row => <NumberFormat value={row.staked_balance} displayType='text' thousandSeparator=' ' suffix=' HNT' />,
        sortable: true
      }
    ];
  }

  componentDidMount () {
    return Promise.all([
      HeliumAPI.getBlockchainStats(),
      HeliumAPI.getRichestAccounts(),
      HeliumAPI.getStatsForValidators()
    ]).then(res => {
      console.log(res[1].data.data);

      const generalInfo = {
        hotspots: {
          total: res[0].data.data.counts.hotspots,
          online: res[0].data.data.counts.hotspots_online,
          dataonly: res[0].data.data.counts.hotspots_dataonly
        },
        blockHeight: res[0].data.data.counts.blocks,
        geolocation: {
          countries: res[0].data.data.counts.countries,
          cities: res[0].data.data.counts.cities
        },
        richestAccounts: res[1].data.data,
        validators: {
          active: res[2].data.data.active,
          cooldown: res[2].data.data.cooldown,
          staked: res[2].data.data.staked,
          unstaked: res[2].data.data.unstaked
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
              <InfoBlock className='decor' title='Block height' number={this.props.generalInfo.blockHeight} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Hotspots total' number={this.props.generalInfo.hotspots.total} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Hotspots online' number={this.props.generalInfo.hotspots.online} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Hotspots dataonly' number={this.props.generalInfo.hotspots.dataonly} />
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
          <div className='row'>
            <h2>Validators stats</h2>
          </div>
          <div className='row'>
            <div className='col-2'>
              <InfoBlock title='Active validators' number={this.props.generalInfo.validators.active} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Staked validators' number={this.props.generalInfo.validators.staked.count} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Staked validators amount' number={this.props.generalInfo.validators.staked.amount / 1000000} suffix='M HNT' decimals={2} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Unstaked validators' number={this.props.generalInfo.validators.unstaked.count} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Unstaked validators amount' number={this.props.generalInfo.validators.unstaked.amount} />
            </div>
          </div>
          <div className='row'>
            <h2>Richest accounts</h2>
          </div>
          <div className='row'>
            <DataTable
              columns={this.columns}
              data={this.props.generalInfo.richestAccounts}
              pagination
              responsive
              striped
            />
          </div>
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
