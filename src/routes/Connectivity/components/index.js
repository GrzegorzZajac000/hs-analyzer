import React from 'react';
import '../styles/Connectivity.scss';
import PropTypes from 'prop-types';

class Connectivity extends React.Component {
  constructor (props) {
    super(props);
    this.generateListenAddresses = this.generateListenAddresses.bind(this);
  }

  generateListenAddresses () {
    const listenAddressRegex = /^\/ip4\/(.*)\/tcp\/(.*)/;

    return this.props.hsInfo.status.listen_addrs.filter(la => {
      return listenAddressRegex.test(la);
    }).map((addr, i) => {
      const [, ip, port] = listenAddressRegex.exec(addr);

      return (
        <div className='connectivity-address' key={i}>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-3'>
                <h2>Hotspot IP</h2>
                <h3>{ip}</h3>
              </div>
              <div className='col-3'>
                <h2>Hotspot port</h2>
                <h3>{port}</h3>
              </div>
            </div>
            <div className='row'>
              <div className='col-6'>
                <button className='btn btn-decor btn-lg'>Check port state</button>
                <button className='btn btn-decor btn-lg'>Ping</button>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  render () {
    return (
      <section className='connectivity route-section'>
        {this.generateListenAddresses()}
        <pre>
          <code>
            ...
          </code>
        </pre>
      </section>
    );
  }
}

Connectivity.propTypes = {
  hsInfo: PropTypes.object
};

export default Connectivity;
