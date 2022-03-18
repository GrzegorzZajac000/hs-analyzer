import React from 'react';
import '../styles/HSInfoModal.scss';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import HSName from '../../../utilities/HSName';
import { X } from 'react-bootstrap-icons';
import isCurrentHS from '../../../utilities/isCurrentHS';

class HSInfoModal extends React.Component {
  renderLocation (hsInfo) {
    if (!hsInfo || !hsInfo.geocode || !hsInfo.geocode.long_city || !hsInfo.geocode.long_country || !hsInfo.geocode.long_street) {
      return '-';
    }

    return `${hsInfo.geocode.long_city} ${hsInfo.geocode.long_street}, ${hsInfo.geocode.long_country}`;
  }

  renderAntenna (hsInfo) {
    if (!hsInfo || !hsInfo.gain || !hsInfo.elevation) {
      return '-';
    }

    return `${hsInfo.gain / 10}dBi, ${hsInfo.elevation}m`;
  }

  render () {
    if (this.props.hsList.length <= 0 || !isCurrentHS(this.props.currentHS)) {
      return null;
    }

    const hsInfo = this.props.hsList[this.props.currentHS].data;

    return (
      <Modal
        className='hs-info-modal'
        show={this.props.show}
        onHide={this.props.onHide}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop
        keyboard
      >
        <button className='hs-info-modal-close' onClick={this.props.onHide}>
          <X />
        </button>

        <h2>{HSName.toView(hsInfo.name)}</h2>
        <h3>{hsInfo.address}</h3>

        <table>
          <tbody>
            <tr>
              <td>Status</td>
              <td>{hsInfo.status.online}</td>
            </tr>
            <tr>
              <td>Height</td>
              <td>{hsInfo.status.height}</td>
            </tr>
            <tr>
              <td>Last change block</td>
              <td>{hsInfo.last_change_block}</td>
            </tr>
            <tr>
              <td>Last POC challenge</td>
              <td>{hsInfo.last_poc_challenge}</td>
            </tr>
            <tr>
              <td>Reward scale</td>
              <td>{hsInfo.reward_scale.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Antenna info</td>
              <td>{this.renderAntenna(hsInfo)}</td>
            </tr>
            <tr>
              <td>Location</td>
              <td>{this.renderLocation(hsInfo)}</td>
            </tr>
            <tr>
              <td>Location hex</td>
              <td>
                <a href={`https://explorer.helium.com/hotspots/hex/${hsInfo.location_hex}`} target='_blank' rel='noreferrer noopener'>{hsInfo.location_hex}</a>
              </td>
            </tr>
            <tr>
              <td>Owner</td>
              <td>
                <a href={`https://explorer.helium.com/accounts/${hsInfo.owner}`} target='_blank' rel='noreferrer noopener'>{hsInfo.owner}</a>
              </td>
            </tr>
            <tr>
              <td>Added in block</td>
              <td>{hsInfo.block_added}</td>
            </tr>
          </tbody>
        </table>
      </Modal>
    );
  }
}

HSInfoModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  hsList: PropTypes.array,
  currentHS: PropTypes.number
};

export default HSInfoModal;
