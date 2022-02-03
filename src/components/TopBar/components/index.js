import React from 'react';
import '../styles/TopBar.scss';
import { ArrowClockwise } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import HSName from '../../../utilities/HSName';

class TopBar extends React.Component {
  constructor (props) {
    super(props);
    this.handleHsRefresh = this.handleHsRefresh.bind(this);
  }

  renderLocation () {
    if (!this.props.hsInfo || !this.props.hsInfo.geocode || !this.props.hsInfo.geocode.long_city || !this.props.hsInfo.geocode.short_country) {
      return '-';
    }

    return `${this.props.hsInfo.geocode.long_city}, ${this.props.hsInfo.geocode.short_country}`;
  }

  renderAntenna () {
    if (!this.props.hsInfo || !this.props.hsInfo.gain || !this.props.hsInfo.elevation) {
      return '-';
    }

    return `${this.props.hsInfo.gain / 10}dBi, ${this.props.hsInfo.elevation}m`;
  }

  handleHsRefresh () {
    return this.props.clearHsInfo();
  }

  render () {
    if (this.props.hsInfo && Object.keys(this.props.hsInfo).length > 0) {
      return (
        <section className='top-bar'>
          <div className='top-bar-configured'>
            <div className='top-bar-left'>
              <div className='top-bar-hs'>
                <p><strong>Hotspot name</strong></p>
                <p>{HSName.toView(this.props.hsInfo.name) || '-'}</p>
              </div>
              <div className='top-bar-hs'>
                <p><strong>Hotspot address</strong></p>
                <p title={this.props.hsInfo.address}>{(this.props.hsInfo.address.substr(0, 20) + '...') || '-'}</p>
              </div>
              <div className='top-bar-hs'>
                <p><strong>Location</strong></p>
                <p>{this.renderLocation()}</p>
              </div>
              <div className='top-bar-hs'>
                <p><strong>Antenna</strong></p>
                <p>{this.renderAntenna()}</p>
              </div>
            </div>

            <div className='top-bar-right'>
              <div className='top-bar-dropdown'>
                <div className='dropdown'>
                  <button
                    className='btn btn-secondary dropdown-toggle'
                    type='button'
                    id='dropdownMenuButton'
                    data-bs-toggle='dropdown'
                    aria-haspopup='true'
                    aria-expanded='false'
                  >
                    Check other tools
                  </button>
                  <div className='dropdown-menu dropdown-menu-end' aria-labelledby='dropdownMenuButton'>
                    <a className='dropdown-item' href={`https://explorer.helium.com/hotspots/${this.props.hsInfo.address}`}>Helium Explorer</a>
                    <a className='dropdown-item' href={`https://app.hotspotty.net/hotspots/${this.props.hsInfo.address}/status`}>Hotspotty</a>
                    <a className='dropdown-item' href={`https://www.heliumtracker.io/hotspots/${this.props.hsInfo.address}`}>HeliumTracker</a>
                    <a className='dropdown-item' href={`https://etl.dewi.org/dashboard/7-hotspot-details?hotspot_address=${this.props.hsInfo.address}&days=30`}>ETL dewi</a>
                    <a className='dropdown-item' href={`https://app.heliumstatus.io/hotspots/${this.props.hsInfo.address}`}>HeliumStatus.io (Paid)</a>
                  </div>
                </div>
              </div>

              <div className='top-bar-refresh'>
                <button type='button' className='btn btn-decor btn-refresh' onClick={this.handleHsRefresh}>
                  <ArrowClockwise size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className='top-bar'>
        <div className='top-bar-unconfigured'>
          <p className='top-bar-unconfigured-text'>Add information in config to continue...</p>
        </div>
      </section>
    );
  }
}

TopBar.propTypes = {
  hsInfo: PropTypes.object,
  clearHsInfo: PropTypes.func
};

export default TopBar;
