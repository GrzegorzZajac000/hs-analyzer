import React from 'react';
import '../styles/Connectivity.scss';
import { BaseComponent, HSName, sendErrorToast } from '../../../utilities';
import ConnectivityAPI from '../../../api/ConnectivityAPI';
import HeliumAPI from '../../../api/HeliumAPI';
import PropTypes from 'prop-types';
import { FormButton } from '../../../components';
import { Navigate } from 'react-router-dom';
import { captureException } from '@sentry/react';

class Connectivity extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      correctIPAddress: false,
      loading: false,
      textarea: 'Ready for connectivity test...\r\n=========================================================='
    };

    this.consoleRef = React.createRef();

    this.generateListenAddresses = this.generateListenAddresses.bind(this);
    this.checkPortState = this.checkPortState.bind(this);
    this.ping = this.ping.bind(this);
    this.refreshInfo = this.refreshInfo.bind(this);
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.currentHS !== this.props.currentHS && this.props.currentHS === null) {
      this.updateState({ textarea: 'Ready for connectivity test...\r\n==========================================================' });
    } else if (prevProps.currentHS !== this.props.currentHS && !!this.props.currentHS) {
      this.updateState({ textarea: 'Ready for connectivity test...\r\n==========================================================' });
    }
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
          captureException(err);
          sendErrorToast('Something went wrong with Helium API. Try one more time');
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
          captureException(err);
          sendErrorToast('Something went wrong with Helium API. Try one more time');
          this.updateState({ loading: false });
        });
    });
  }

  refreshInfo () {
    const hs = this.props.hsList[this.props.currentHS];

    this.updateState({
      loading: true,
      textarea: `${this.state.textarea}\r\n${new Date().toISOString().substring(0, 19).replace('T', ' ')} Refreshing info for ${HSName.toView(hs.data.name)}...`
    }, () => {
      return HeliumAPI.getHotspotForAddress(hs.value)
        .then(res => {
          const hsObj = {};
          hsObj.value = res.data.data.address;
          hsObj.label = HSName.toView(res.data.data.name);
          hsObj.data = res.data.data;

          return this.props.updateHS(hsObj, this.props.currentHS);
        })
        .then(() => {
          this.updateState({
            loading: false,
            textarea: `${this.state.textarea}\r\n${new Date().toISOString().substring(0, 19).replace('T', ' ')} Refreshing info done for ${HSName.toView(hs.data.name)}`
          });
        })
        .catch(err => {
          console.error(err);
          captureException(err);
          this.updateState({ loading: false });
          sendErrorToast('Something went wrong with Helium API. Try one more time');
        });
    });
  }

  generateListenAddresses () {
    const listenAddressRegex = /^\/ip4\/(.*)\/tcp\/(.*)/;

    const ipAdresses = this.props.hsList[this.props.currentHS].data.status.listen_addrs.filter(la => {
      return listenAddressRegex.test(la);
    });

    if (ipAdresses.length <= 0) {
      return (
        <div className='alert alert-danger'>
          <strong>No IPv4 listen addresses found</strong>
        </div>
      );
    }

    return ipAdresses.map((addr, i) => {
      const [, ip, port] = listenAddressRegex.exec(addr);

      return (
        <div className='connectivity-address' key={i}>
          <div className='container-fluid'>
            <div className='row connectivity-address-api'>
              <div className='col-12 col-sm-6 col-md-3'>
                <h2>Hotspot IP</h2>
                <h3>{ip}</h3>
              </div>
              <div className='col-12 col-sm-6 col-md-3'>
                <h2>Hotspot port</h2>
                <h3>{port}</h3>
              </div>
            </div>
            <div className='row'>
              <div className='col-6 connectivity-address-buttons'>
                <FormButton className='btn btn-decor btn-lg' onClick={() => this.checkPortState(ip, port)} disabled={this.state.loading}>Check port state</FormButton>
                <FormButton className='btn btn-decor btn-lg' onClick={() => this.ping(ip)} disabled={this.state.loading}>Ping</FormButton>
                <FormButton className='btn btn-warning btn-lg' onClick={() => this.refreshInfo()} disabled={this.state.loading}>Refresh HS Info</FormButton>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  render () {
    if (this.props.currentHS === null) {
      return <Navigate to='/' />;
    }

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

Connectivity.propTypes = {
  updateHS: PropTypes.func,
  hsList: PropTypes.array,
  currentHS: PropTypes.number
};

export default Connectivity;
