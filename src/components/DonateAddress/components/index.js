import React from 'react';
import '../styles/DonateAddress.scss';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

class DonateAddress extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      address: '14aJz2XEweHeLW4PLddJuumBuDfVW9XwRZemn35PYu3GUBiuJcc'
    };

    this.handleCopy = this.handleCopy.bind(this);
  }

  handleCopy () {
    toast.success('Wallet address copied', {
      theme: 'dark'
    });
  }

  render () {
    return (
      <CopyToClipboard text={this.state.address} onCopy={this.handleCopy}>
        <p title='Click to copy wallet address' className='donate-address'>{this.state.address}</p>
      </CopyToClipboard>
    );
  }
}

export default DonateAddress;
