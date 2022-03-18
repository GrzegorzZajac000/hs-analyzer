import React from 'react';
import '../styles/HSModal.scss';
import { AddressForm, NameForm, WalletForm } from '../../../components';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';

class HSModal extends React.Component {
  constructor (props) {
    super(props);
    this.props.hideHSModal();
    this.handleHide = this.handleHide.bind(this);
  }

  handleHide () {
    this.props.hideHSModal();
  }

  render () {
    return (
      <Modal
        show={this.props.hsModal}
        onHide={this.handleHide}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop
        keyboard
      >
        <div className='hs-modal'>
          <h2>Add your hotspot</h2>

          <ul className='nav nav-tabs' id='config-tab' role='tablist'>
            <li className='nav-item' role='presentation'>
              <button
                className='nav-link active'
                id='config-tab-name'
                data-bs-toggle='tab'
                data-bs-target='#config-tab-name-content'
                type='button'
                role='tab'
                aria-controls='config-tab-name'
                aria-selected='true'
              >
                By name
              </button>
            </li>
            <li className='nav-item' role='presentation'>
              <button
                className='nav-link'
                id='config-tab-address'
                data-bs-toggle='tab'
                data-bs-target='#config-tab-address-content'
                type='button'
                role='tab'
                aria-controls='config-tab-address'
                aria-selected='false'
              >
                By address
              </button>
            </li>
            <li className='nav-item' role='presentation'>
              <button
                className='nav-link'
                id='config-tab-wallet'
                data-bs-toggle='tab'
                data-bs-target='#config-tab-wallet-content'
                type='button'
                role='tab'
                aria-controls='config-tab-wallet'
                aria-selected='false'
              >
                By wallet
              </button>
            </li>
          </ul>
          <div className='tab-content' id='home-tab-content'>
            <div className='tab-pane fade show active' id='config-tab-name-content' role='tabpanel' aria-labelledby='config-tab-name'>
              <NameForm />
            </div>
            <div className='tab-pane fade' id='config-tab-address-content' role='tabpanel' aria-labelledby='config-tab-address'>
              <AddressForm />
            </div>
            <div className='tab-pane fade' id='config-tab-wallet-content' role='tabpanel' aria-labelledby='config-tab-wallet'>
              <WalletForm />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

HSModal.propTypes = {
  hsModal: PropTypes.bool,
  hideHSModal: PropTypes.func
};

export default HSModal;
