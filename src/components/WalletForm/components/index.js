import React from 'react';
import '../styles/WalletForm.scss';
import { Form, Field } from 'react-final-form';
import HeliumAPI from '../../../api/HeliumAPI';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { BaseComponent, HSName } from '../../../utilities';
import { FormButton } from '../../';

class WalletForm extends BaseComponent {
  constructor (props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async validate (values) {
    const addressExp = /^[a-zA-Z0-9]{40,60}$/;
    let errors = {};

    if (!values.wallet) {
      errors.wallet = 'Ooops! Your wallet is required';
      return errors;
    } else if (!addressExp.test(values.wallet)) {
      errors.wallet = 'Your wallet address is wrong. Check it one more time';
      return errors;
    } else {
      errors = await HeliumAPI.getHotspotsForAccount(values.wallet)
        .then(hses => {
          if (!hses || hses.length < 1) {
            errors.wallet = 'There are no hotspots on this wallet';
          }

          return errors;
        })
        .catch(() => {
          errors.wallet = 'Something went wrong with Helium API. Try one more time';
          return errors;
        });
    }
  }

  handleSubmit (values) {
    return HeliumAPI.getHotspotsForAccount(values.wallet)
      .then(hses => {
        if (!hses || hses.length <= 0) {
          toast.error('This wallet doesn\'t have any connected hotspots', { theme: 'dark' });
          return Promise.reject(new Error('This wallet doesn\'t have any connected hotspots'));
        }

        return hses.map(res => {
          const hs = {};

          if (!res || !res.address) {
            toast.error('HS from list doesn\'t have an hotspot address. Helium API Error', { theme: 'dark' });
            return Promise.reject(new Error('HS from list doesn\'t have an hotspot address. Helium API Error'));
          }

          let hsList = this.props.hsList;
          hsList = hsList.filter(hs => hs.value === res.address);

          if (hsList.length > 0) {
            toast.error(`Ooops! Hotspot ${hsList[0].label} is on the list`, { theme: 'dark' });
            return Promise.reject(new Error(`Ooops! Hotspot is on the list`));
          }

          hs.value = res.address;
          hs.label = HSName.toView(res.name);
          hs.data = res;

          return this.props.addHSToList(hs);
        });
      })
      .then(() => this.props.hideHSModal())
      .then(() => this.props.useHS(this.props.hsList.length - 1))
      .catch(() => {});
  }

  render () {
    return (
      <div className='config-form'>
        <Form onSubmit={values => this.handleSubmit(values)} validate={this.validate} render={({ handleSubmit, form, submitting, pristine, invalid, values }) => (
          <form onSubmit={values => handleSubmit(values)} id='address-form'>
            <div className='config-form-input'>
              <Field type='text' name='wallet'>
                {({ input, meta }) => (
                  <React.Fragment>
                    <label htmlFor='wallet'>Wallet address</label>
                    <input {...input} className='hs-input' id='wallet' placeholder='Wallet Address' autoFocus />
                    <p className='input-error'>{meta.submitFailed && meta.error}</p>
                  </React.Fragment>
                )}
              </Field>
            </div>
            <div className='config-form-submit'>
              <FormButton
                className='btn btn-md btn-decor'
                type='submit'
                disabled={submitting}
              >
                Submit
              </FormButton>
            </div>
          </form>
        )}
        />
      </div>
    );
  }
}

WalletForm.propTypes = {
  addHSToList: PropTypes.func,
  hideHSModal: PropTypes.func,
  hsList: PropTypes.array,
  useHS: PropTypes.func
};

export default WalletForm;
