import React from 'react';
import '../styles/Info.scss';
import { InfoBlock } from '../../../components';
import HeliumAPI from '../../../api/HeliumAPI';
import { BaseComponent, sendErrorToast } from '../../../utilities';
import DataTable from 'react-data-table-component';
import NumberFormat from 'react-number-format';
import pLimit from 'p-limit';

const limit = pLimit(1);

class Info extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      data: [],
      loaded: false
    };

    this.columns = [
      {
        name: 'Address',
        selector: row => row.address,
        format: row => <a href={`https://explorer.helium.com/accounts/${row.address}`} target='_blank' rel='noreferrer noopener'>{row.address}</a>
      },
      {
        id: 'balance',
        name: 'Balance',
        selector: row => row.balance,
        format: row => <NumberFormat value={row.balance} displayType='text' thousandSeparator=' ' suffix=' HNT' />,
        sortable: true,
        right: true
      },
      {
        name: 'Staked balance',
        selector: row => row.staked_balance,
        format: row => <NumberFormat value={row.staked_balance} displayType='text' thousandSeparator=' ' suffix=' HNT' />,
        sortable: true,
        right: true
      }
    ];
  }

  componentDidMount () {
    return Promise.all([
      limit(() => HeliumAPI.getBlockchainStats()),
      limit(() => HeliumAPI.getRichestAccounts()),
      limit(() => HeliumAPI.getStatsForValidators())
    ]).then(res => {
      const data = {
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

      return this.updateState({ data, loaded: true });
    }).catch(err => {
      console.error(err);
      sendErrorToast('Something went wrong with Helium API. Try one more time');
    });
  }

  render () {
    if (!this.state.loaded) {
      return (
        <section className='info route-section'>
          <div className='preload show-preloader'>
            <div className='preload-circle'>
              <div />
              <div />
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className='info route-section'>
        <div className='container-fluid'>
          <div className='row'>
            <h2>Helium stats</h2>
          </div>
          <div className='row'>
            <div className='col-12'>
              <div className='info-blocks-container'>
                <InfoBlock className='decor' title='Block height' number={this.state.data.blockHeight} />
                <InfoBlock title='Hotspots total' number={this.state.data.hotspots.total} />
                <InfoBlock title='Hotspots online' number={this.state.data.hotspots.online} />
                <InfoBlock title='Hotspots dataonly' number={this.state.data.hotspots.dataonly} />
              </div>
            </div>
          </div>
          <div className='row'>
            <h2>Geolocation stats</h2>
          </div>
          <div className='row'>
            <div className='col-12'>
              <div className='info-blocks-container'>
                <InfoBlock title='Countries' number={this.state.data.geolocation.countries} />
                <InfoBlock title='Cities' number={this.state.data.geolocation.cities} />
              </div>
            </div>
          </div>
          <div className='row'>
            <h2>Validators stats</h2>
          </div>
          <div className='row'>
            <div className='col-12'>
              <div className='info-blocks-container'>
                <InfoBlock title='Active validators' number={this.state.data.validators.active} />
                <InfoBlock title='Staked validators' number={this.state.data.validators.staked.count} />
                <InfoBlock title='Staked validators amount' number={this.state.data.validators.staked.amount / 1000000} suffix='M HNT' decimals={2} />
                <InfoBlock title='Unstaked validators' number={this.state.data.validators.unstaked.count} />
                <InfoBlock title='Unstaked validators amount' number={this.state.data.validators.unstaked.amount} />
              </div>
            </div>
          </div>
          <div className='row'>
            <h2>Richest accounts</h2>
          </div>
          <div className='row'>
            <div className='col-12'>
              <DataTable
                columns={this.columns}
                data={this.state.data.richestAccounts}
                pagination
                responsive
                striped
                defaultSortFieldId='balance'
                defaultSortAsc={false}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              <p className='legacy-info'>If you liked old version of this tool, you can use it on <a href='https://legacy.hs-analyzer.com/' target='_blank' rel='noreferrer noopener'>https://legacy.hs-analyzer.com</a> :)</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Info;
