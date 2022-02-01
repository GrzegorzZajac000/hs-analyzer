import React from 'react';
import '../styles/Config.scss';
import { AddressForm, NameForm } from '../../../components';

class Config extends React.Component {
  render () {
    return (
      <section className='home route-section'>
        <h2>Find your hotspot</h2>

        <ul className='nav nav-tabs' id='config-tab' role='tablist'>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link active'
              id='config-tab-name'
              data-bs-toggle='tab'
              data-bs-target='#config-tab-name-content'
              type='button'
              role='tab'
              aria-controls='config-tab-name'
              aria-selected='true'
            >
              By name
            </button>
          </li>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link'
              id='config-tab-address'
              data-bs-toggle='tab'
              data-bs-target='#config-tab-address-content'
              type='button'
              role='tab'
              aria-controls='config-tab-address'
              aria-selected='false'
            >
              By address
            </button>
          </li>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link coming-soon'
              id='config-tab-wallet'
              data-bs-toggle='tab'
              data-bs-target='#config-tab-wallet-content'
              type='button'
              role='tab'
              aria-controls='config-tab-wallet'
              aria-selected='false'
              disabled
            >
              By wallet
              <span className='nav-link-coming-soon'>Coming soon</span>
            </button>
          </li>
        </ul>
        <div className='tab-content' id='home-tab-content'>
          <div className='tab-pane fade show active' id='config-tab-name-content' role='tabpanel' aria-labelledby='config-tab-name'>
            <div className='container-fluid'>
              <div className='row justify-content-center'>
                <div className='col-6'>
                  <NameForm />
                </div>
              </div>
            </div>
          </div>
          <div className='tab-pane fade' id='config-tab-address-content' role='tabpanel' aria-labelledby='config-tab-address'>
            <div className='container-fluid'>
              <div className='row justify-content-center'>
                <div className='col-6'>
                  <AddressForm />
                </div>
              </div>
            </div>
          </div>
          <div className='tab-pane fade' id='config-tab-wallet-content' role='tabpanel' aria-labelledby='config-tab-wallet' />
        </div>
      </section>
    );
  }
}

export default Config;