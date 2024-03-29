import React from 'react';
import '../styles/HSInfoModal.scss';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { X } from 'react-bootstrap-icons';
import { BaseComponent, HSName, isCurrentHS, sendErrorToast } from '../../../utilities';
import HeliumAPI from '../../../api/HeliumAPI';
import { toast } from 'react-toastify';
import { FormButton } from '../../';
import { captureException } from '@sentry/react';

class HSInfoModal extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      refreshing: false,
      blockchainHeight: 0
    };

    this.refreshInfo = this.refreshInfo.bind(this);
  }

  componentDidMount () {
    HeliumAPI.getBlockchainHeight().then(res => this.updateState({ blockchainHeight: res.data.data.height }));
  }

  refreshInfo () {
    if (!isCurrentHS(this.props.currentHS) || this.props.hsList.length <= 0) {
      return;
    }

    const hs = this.props.hsList[this.props.currentHS];

    this.updateState({ refreshing: true }, () => {
      return HeliumAPI.getHotspotForAddress(hs.value)
        .then(res => {
          const hsObj = {};
          hsObj.value = res.data.data.address;
          hsObj.label = HSName.toView(res.data.data.name);
          hsObj.data = res.data.data;

          return this.props.updateHS(hsObj, this.props.currentHS);
        })
        .then(() => HeliumAPI.getBlockchainHeight())
        .then(res => {
          this.updateState({ blockchainHeight: res.data.data.height, refreshing: false });
          toast.success('HS info updated!', { theme: 'dark' });
        })
        .catch(err => {
          console.error(err);
          captureException(err);
          this.updateState({ refreshing: false });
          sendErrorToast('Something went wrong with Helium API. Try one more time');
        });
    });
  }

  renderLocation (hsInfo) {
    if (!hsInfo || !hsInfo.geocode || !hsInfo.geocode.long_city || !hsInfo.geocode.long_country || !hsInfo.geocode.long_street) {
      return '???';
    }

    return `${hsInfo.geocode.long_city} ${hsInfo.geocode.long_street}, ${hsInfo.geocode.long_country}`;
  }

  renderAntenna (hsInfo) {
    if (!hsInfo || !hsInfo.gain || !hsInfo.elevation) {
      return '???';
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

        <div className='hs-info-modal-refresh'>
          <FormButton className='btn btn-warning btn-sm' onClick={() => this.refreshInfo()} disabled={this.state.refreshing}>Refresh HS Info</FormButton>
        </div>

        <table>
          <tbody>
            <tr>
              <td>Status</td>
              <td>{(hsInfo && hsInfo.status && hsInfo.status.online) ? hsInfo.status.online : '???'}</td>
            </tr>
            <tr>
              <td>Height</td>
              <td>{(hsInfo && hsInfo.status && hsInfo.status.height) ? hsInfo.status.height : '???'} / {this.state.blockchainHeight} = {this.state.blockchainHeight - hsInfo.status.height}</td>
            </tr>
            <tr>
              <td>Last change block</td>
              <td>{(hsInfo && hsInfo.last_change_block) ? hsInfo.last_change_block : '???'}</td>
            </tr>
            <tr>
              <td>Last POC challenge</td>
              <td>{(hsInfo && hsInfo.last_poc_challenge) ? hsInfo.last_poc_challenge : '???'}</td>
            </tr>
            <tr>
              <td>Reward scale</td>
              <td>{hsInfo.reward_scale ? hsInfo.reward_scale.toFixed(2) : '???'}</td>
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
                {
                  (hsInfo && hsInfo.location_hex) ? <a href={`https://explorer.helium.com/hotspots/hex/${hsInfo.location_hex}`} target='_blank' rel='noreferrer noopener'>{hsInfo.location_hex}</a> : '???'
                }
              </td>
            </tr>
            <tr>
              <td>Owner</td>
              <td>
                {
                  (hsInfo && hsInfo.owner) ? <a href={`https://explorer.helium.com/accounts/${hsInfo.owner}`} target='_blank' rel='noreferrer noopener'>{hsInfo.owner}</a> : '???'
                }
              </td>
            </tr>
            <tr>
              <td>Added in block</td>
              <td>{(hsInfo && hsInfo.block_added) ? hsInfo.block_added : '???'}</td>
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
  currentHS: PropTypes.number,
  updateHS: PropTypes.func
};

export default HSInfoModal;
