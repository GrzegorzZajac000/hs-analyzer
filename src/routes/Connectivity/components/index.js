import React from 'react';
import '../styles/Connectivity.scss';
import PropTypes from 'prop-types';

// WARNING
// Can't be done without Node server
// @todo future

class Connectivity extends React.Component {
  constructor (props) {
    super(props);

    this.consoleRef = React.createRef();

    this.generateListenAddresses = this.generateListenAddresses.bind(this);
    this.checkPortState = this.checkPortState.bind(this);
    this.ping = this.ping.bind(this);
  }

  checkPortState (host, port) {
    console.log('checkPortState', host, port);
  }

  ping (host, port) {
    console.log('ping', host, port);
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
            <div className='row connectivity-address-api'>
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
              <div className='col-6 connectivity-address-buttons'>
                <button className='btn btn-decor btn-lg' onClick={() => this.checkPortState(ip, port)}>Check port state</button>
                <button className='btn btn-decor btn-lg' onClick={() => this.ping(ip, port)}>Ping</button>
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
          <code ref={this.consoleRef}>
            Ready for connectivity test...
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
