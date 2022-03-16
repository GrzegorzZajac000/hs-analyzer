import React from 'react';
import '../styles/TopBar.scss';
import PropTypes from 'prop-types';
// import HSName from '../../../utilities/HSName';
import Select from 'react-select';

class TopBar extends React.Component {
  constructor (props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.generateDropdown = this.generateDropdown.bind(this);
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

  generateDropdown () {
    if (Number.isInteger(this.props.currentHS) && this.props.currentHS !== 0) {
      return (
        <React.Fragment>
          <a className='dropdown-item' href={`https://explorer.helium.com/hotspots/${this.props.hsInfo.address}`} target='_blank' rel='noreferrer noopener'>Helium Explorer</a>
          <a className='dropdown-item' href={`https://app.hotspotty.net/hotspots/${this.props.hsInfo.address}/status`} target='_blank' rel='noreferrer noopener'>Hotspotty</a>
          <a className='dropdown-item' href={`https://www.heliumtracker.io/hotspots/${this.props.hsInfo.address}`} target='_blank' rel='noreferrer noopener'>HeliumTracker</a>
          <a className='dropdown-item' href={`https://etl.dewi.org/dashboard/7-hotspot-details?hotspot_address=${this.props.hsInfo.address}&days=30`} target='_blank' rel='noreferrer noopener'>ETL dewi</a>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <a className='dropdown-item' href='https://explorer.helium.com/' target='_blank' rel='noreferrer noopener'>Helium Explorer</a>
        <a className='dropdown-item' href='https://app.hotspotty.net/' target='_blank' rel='noreferrer noopener'>Hotspotty</a>
        <a className='dropdown-item' href='https://www.heliumtracker.io/' target='_blank' rel='noreferrer noopener'>HeliumTracker</a>
        <a className='dropdown-item' href='https://etl.dewi.org/dashboard/4-network-overview' target='_blank' rel='noreferrer noopener'>ETL dewi</a>
      </React.Fragment>
    )
  }

  handleChange (option) {
    if (option.value === 'new-hs') {
      this.props.showHSModal();
    } else {
      console.log('old hotspot');
    }
  }

  render () {
    return (
      <section className='top-bar'>
        <div className='top-bar-left'>
          <Select
            className='react-select'
            classNamePrefix='rs'
            options={this.props.hsList.concat({
              label: 'Add new hotspot',
              value: 'new-hs'
            })}
            placeholder='Add or select hotspot...'
            onChange={this.handleChange}
          />
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
                {this.generateDropdown()}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

TopBar.propTypes = {
  currentHS: PropTypes.number,
  hsInfo: PropTypes.object,
  hsList: PropTypes.array,
  showHSModal: PropTypes.func
};

export default TopBar;
