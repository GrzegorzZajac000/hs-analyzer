import React from 'react';
import '../styles/SettingsModal.scss';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { X } from 'react-bootstrap-icons';
import { BaseComponent } from '../../../utilities';

class HSInfoModal extends BaseComponent {
  constructor (props) {
    super(props);

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  handleCheckboxChange = (e) => {
    this.props.setAutoExpand(e.target.checked);
  }

  render () {
    return (
      <Modal
        className='settings-modal'
        show={this.props.show}
        onHide={this.props.onHide}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop
        keyboard
      >
        <button className='settings-modal-close' onClick={this.props.onHide}>
          <X />
        </button>

        <h2>Settings</h2>

        <div className='auto-expand-box'>
          <input type='checkbox' value={0} checked={this.props.autoExpand} id='city-auto-expand' onChange={this.handleCheckboxChange} />
          <label htmlFor='city-auto-expand'>
            <span>Auto expand</span>
          </label>
          <label className='switch' htmlFor='city-auto-expand' />
        </div>
      </Modal>
    );
  }
}

HSInfoModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  hsList: PropTypes.array,
  currentHS: PropTypes.number,
  updateHS: PropTypes.func
};

export default HSInfoModal;
