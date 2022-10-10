import React from 'react';
import '../styles/Donate.scss';
import QRCode from 'react-qr-code';
import DonateAddress from '../../../components/DonateAddress';
import { BaseComponent } from '../../../utilities';

class Donate extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      qr: {
        type: 'payment',
        address: '14aJz2XEweHeLW4PLddJuumBuDfVW9XwRZemn35PYu3GUBiuJcc',
        amount: '0.1',
        memo: 'THX'
      }
    };

    this.handleAmountChange = this.handleAmountChange.bind(this);
  }

  handleAmountChange (e) {
    const qr = this.state.qr;
    qr.amount = e.target.value;

    this.updateState({ qr });
  }

  render () {
    return (
      <section className='donate route-section'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <h2>Donate</h2>
              <p>Here you can buy me a coffee with a donate in HNT. Scan QR code below or copy wallet address and make donate.</p>
              <p>If you are doing it manually, use comma not dot. There is no minimum amount and donation isn't required to access all the features of this tool.</p>

              <div className='donate-content'>
                <div className='donate-qr'>
                  <div className='donate-qr-box'>
                    <div className='donate-qr-box-bg'>
                      <QRCode value={JSON.stringify(this.state.qr)} size={200} level='L' />
                    </div>
                  </div>
                </div>

                <div className='donate-amount'>
                  <label htmlFor='hnt-amount'>HNT Amount</label>
                  <input className='hs-input hs-input-donate' type='number' id='hnt-amount' value={this.state.qr.amount} onChange={this.handleAmountChange} step='0.01' min='0.01' />
                </div>

                <p className='donate-wallet'>Wallet address:</p>
                <DonateAddress />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Donate;
