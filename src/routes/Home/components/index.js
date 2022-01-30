import React from 'react';
import '../styles/Home.scss';

class Home extends React.Component {
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
            By name
          </div>
          <div className='tab-pane fade' id='config-tab-address-content' role='tabpanel' aria-labelledby='config-tab-address'>
            By address
          </div>
          <div className='tab-pane fade' id='config-tab-wallet-content' role='tabpanel' aria-labelledby='config-tab-wallet' />
        </div>
      </section>
    );
  }
}

export default Home;
