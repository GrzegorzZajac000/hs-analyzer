import React from 'react';
import '../styles/TopBar.scss';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { ConfirmModal, HSInfoModal } from '../../index';
import { BaseComponent, isCurrentHS, getOptionLabel } from '../../../utilities';

class TopBar extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      hsInfoModalShow: false,
      removeModalShow: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.generateDropdown = this.generateDropdown.bind(this);
    this.handleHSInfoClick = this.handleHSInfoClick.bind(this);
    this.handleHSInfoHide = this.handleHSInfoHide.bind(this);
    this.handleHSRemoveClick = this.handleHSRemoveClick.bind(this);
    this.handleHSRemoveHide = this.handleHSRemoveHide.bind(this);
    this.handleHSRemoveConfirm = this.handleHSRemoveConfirm.bind(this);
  }

  handleChange (option) {
    if (option.value === 'new-hs') {
      this.props.showHSModal();
    } else {
      this.props.useHS(this.props.hsList.indexOf(option));
    }
  }

  generateDropdown () {
    if (!isCurrentHS(this.props.currentHS)) {
      return null;
    }

    return (
      <React.Fragment>
        <a className='dropdown-item' href={`https://explorer.helium.com/hotspots/${this.props.hsList[this.props.currentHS].data.address}`} target='_blank' rel='noreferrer noopener'>Helium Explorer</a>
        <a className='dropdown-item' href={`https://app.hotspotty.net/hotspots/${this.props.hsList[this.props.currentHS].data.address}/status`} target='_blank' rel='noreferrer noopener'>Hotspotty</a>
        <a className='dropdown-item' href={`https://www.heliumtracker.io/hotspots/${this.props.hsList[this.props.currentHS].data.address}`} target='_blank' rel='noreferrer noopener'>HeliumTracker</a>
        <a className='dropdown-item' href={`https://etl.dewi.org/dashboard/7-hotspot-details?hotspot_address=${this.props.hsList[this.props.currentHS].data.address}&days=30`} target='_blank' rel='noreferrer noopener'>ETL dewi</a>
      </React.Fragment>
    );
  }

  handleHSInfoClick () {
    this.updateState({ hsInfoModalShow: true });
  }

  handleHSInfoHide () {
    this.updateState({ hsInfoModalShow: false });
  }

  handleHSRemoveClick () {
    this.updateState({ removeModalShow: true });
  }

  handleHSRemoveHide () {
    this.updateState({ removeModalShow: false });
  }

  handleHSRemoveConfirm () {
    this.handleHSRemoveHide();

    this.props.removeHSFromList(this.props.currentHS);
    this.props.useHS(null);
  }

  render () {
    return (
      <React.Fragment>
        <section className='top-bar'>
          <div className='top-bar-left'>
            <Select
              className='react-select'
              classNamePrefix='rs'
              options={this.props.hsList.concat({ label: 'Add new hotspot', value: 'new-hs' })}
              placeholder='Add or select hotspot...'
              onChange={this.handleChange}
              value={isCurrentHS(this.props.currentHS) ? this.props.hsList[this.props.currentHS] : { label: 'Add new hotspot', value: 'new-hs' }}
              getOptionLabel={getOptionLabel}
            />
            <div className={'top-bar-left-hs-buttons' + (isCurrentHS(this.props.currentHS) ? '' : ' hidden')}>
              <button className='btn btn-sm btn-decor' onClick={this.handleHSInfoClick}>HS Info</button>
              <button className='btn btn-sm btn-danger' onClick={this.handleHSRemoveClick}>Remove HS from list</button>
            </div>
          </div>

          <div className='top-bar-right'>
            <div className={'top-bar-dropdown' + (isCurrentHS(this.props.currentHS) ? '' : ' hidden')}>
              <div className='dropdown'>
                <button
                  className='btn btn-secondary dropdown-toggle'
                  type='button'
                  id='dropdownMenuButton'
                  data-bs-toggle='dropdown'
                  aria-haspopup='true'
                  aria-expanded='false'
                >
                  Check your HS in other tools
                </button>
                <div className='dropdown-menu dropdown-menu-end' aria-labelledby='dropdownMenuButton'>
                  {this.generateDropdown()}
                </div>
              </div>
            </div>
          </div>
        </section>

        <HSInfoModal show={this.state.hsInfoModalShow} onHide={this.handleHSInfoHide} />
        <ConfirmModal
          show={this.state.removeModalShow}
          onConfirm={this.handleHSRemoveConfirm}
          onHide={this.handleHSRemoveHide}
          message={<React.Fragment>Are you sure to remove <strong>{(this.props.hsList && isCurrentHS(this.props.currentHS)) ? this.props.hsList[this.props.currentHS].label : ''}</strong> from list?</React.Fragment>}
        />
      </React.Fragment>
    );
  }
}

TopBar.propTypes = {
  currentHS: PropTypes.number,
  hsList: PropTypes.array,
  showHSModal: PropTypes.func,
  useHS: PropTypes.func,
  removeHSFromList: PropTypes.func
};

export default TopBar;
