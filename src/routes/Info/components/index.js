import React from 'react';
import '../styles/Info.scss';
import { InfoBlock } from '../../../components';

class Info extends React.Component {
  render () {
    return (
      <section className='info route-section'>
        <div className='container-fluid'>
          <div className='row'>
            <h2>Project stats</h2>
          </div>
          <div className='row'>
            <div className='col-2'>
              <InfoBlock title='Hotspots total' number={535000} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Hotspots online' number={420000} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Hotspots dataonly' number={1000} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Validators total' number={4000} />
            </div>
            <div className='col-2'>
              <InfoBlock className='decor' title='Block height' number={4000} />
            </div>
          </div>
          <div className='row'>
            <h2>Geolocation stats</h2>
          </div>
          <div className='row'>
            <div className='col-2'>
              <InfoBlock title='Countries' number={5} />
            </div>
            <div className='col-2'>
              <InfoBlock title='Cities' number={5} />
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

export default Info;
