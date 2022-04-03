import React from 'react';
import '../styles/Connectivity.scss';
import { BaseComponent } from '../../../utilities';
import ConnectivityAPI from '../../../api/ConnectivityAPI';
import { toast } from 'react-toastify';

class Connectivity extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      loading: false,
      textarea: 'Ready for connectivity test...\r\n=========================================================='
    };

    this.consoleRef = React.createRef();

    this.generateListenAddresses = this.generateListenAddresses.bind(this);
    this.checkPortState = this.checkPortState.bind(this);
    this.ping = this.ping.bind(this);
  }

  checkPortState (host, port) {
    this.updateState({
      loading: true,
      textarea: `${this.state.textarea}\r\n${new Date().toISOString().substring(0, 19).replace('T', ' ')} Checking port ${port} on ${host}...`
    }, () => {
      ConnectivityAPI.checkPort(host, port)
        .then(res => {
          this.updateState({
            loading: false,
            textarea: `${this.state.textarea}\r\n${new Date().toISOString().substring(0, 19).replace('T', ' ')} Checking port response\r\n${JSON.stringify(res.data, null, 4)}`
          }, () => {
            this.consoleRef.current.scrollTop = this.consoleRef.current.scrollHeight;
          });
        })
        .catch(err => {
          console.error(err);

          toast.error('Something went wrong with Helium API. Try one more time', {
            theme: 'dark'
          });

          this.updateState({ loading: false });
        });
    });
  }

  ping (host) {
    this.updateState({
      loading: true,
      textarea: `${this.state.textarea}\r\n${new Date().toISOString().substring(0, 19).replace('T', ' ')} Ping ${host}...`
    }, () => {
      ConnectivityAPI.ping(host)
        .then(res => {
          this.updateState({
            loading: false,
            textarea: `${this.state.textarea}\r\n${new Date().toISOString().substring(0, 19).replace('T', ' ')} Ping response\r\n${JSON.stringify(res.data, null, 4)}`
          }, () => {
            this.consoleRef.current.scrollTop = this.consoleRef.current.scrollHeight;
          });
        })
        .catch(err => {
          console.error(err);

          toast.error('Something went wrong with Helium API. Try one more time', {
            theme: 'dark'
          });

          this.updateState({ loading: false });
        });
    });
  }

  generateListenAddresses () {
    const listenAddressRegex = /^\/ip4\/(.*)\/tcp\/(.*)/;

    return this.props.hsList[this.props.currentHS].data.status.listen_addrs.filter(la => {
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
                <button className='btn btn-decor btn-lg' onClick={() => this.checkPortState(ip, port)} disabled={this.state.loading}>Check port state</button>
                <button className='btn btn-decor btn-lg' onClick={() => this.ping(ip)} disabled={this.state.loading}>Ping</button>
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
        <pre ref={this.consoleRef}>
          <code>
            {this.state.textarea}
          </code>
        </pre>
      </section>
    );
  }
}

export default Connectivity;
