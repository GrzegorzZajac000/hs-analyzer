import React from 'react';
import '../styles/ConfirmModal.scss';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';

class HSInfoModal extends React.Component {
  render () {
    return (
      <Modal
        className='confirm-modal'
        show={this.props.show}
        onHide={this.props.onHide}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop
        keyboard
      >
        <h2>{this.props.message}</h2>

        <div className='confirm-modal-buttons'>
          <button className='btn btn-md btn-danger' onClick={this.props.onConfirm}>Yes</button>
          <button className='btn btn-md btn-decor' onClick={this.props.onHide}>No</button>
        </div>
      </Modal>
    );
  }
}

HSInfoModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onConfirm: PropTypes.func,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
};

export default HSInfoModal;
