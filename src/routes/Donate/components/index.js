import React from 'react';
import '../styles/Donate.scss';
import QRCode from 'react-qr-code';
import DonateAddress from '../../../components/DonateAddress';

class Donate extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      type: 'payment',
      address: '14aJz2XEweHeLW4PLddJuumBuDfVW9XwRZemn35PYu3GUBiuJcc',
      amount: '0.1',
      memo: 'THX'
    };

    this.handleAmountChange = this.handleAmountChange.bind(this);
  }

  handleAmountChange (e) {
    this.setState({ ...this.state, amount: e.target.value });
  }

  render () {
    return (
      <section className='donate route-section'>
        <div className='container-fluid'>
          <div className='row justify-content-center'>
            <div className='col-6'>
              <h2>Donate</h2>
              <p>Here you can buy me a coffee with a donate in HNT. Scan QR code below or copy wallet address and make donate.</p>
              <p>If you are doing it manually, use comma not dot. There is no minimum amount and donation isn't required to access all the features of this tool.</p>

              <div className='donate-content'>
                <div className='donate-qr'>
                  <div className='donate-qr-box'>
                    <QRCode value={JSON.stringify(this.state)} size={256} level='L' />
                  </div>
                </div>

                <div className='donate-amount'>
                  <label htmlFor='hnt-amount'>HNT Amount</label>
                  <input className='hs-input hs-input-donate' type='number' id='hnt-amount' value={this.state.amount} onChange={this.handleAmountChange} step='0.01' min='0.01' />
                </div>

                <p className='donate-wallet'>Wallet address:</p>
                <DonateAddress />

                <p className='donate-thank-you'>Thank you</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Donate;
