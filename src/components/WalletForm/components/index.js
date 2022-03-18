import React from 'react';
import '../styles/WalletForm.scss';
import { Form, Field } from 'react-final-form';
import HeliumAPI from '../../../api/HeliumAPI';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import HSName from '../../../utilities/HSName';

class WalletForm extends React.Component {
  constructor (props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validate (values) {
    const addressExp = /^[a-zA-Z0-9]{40,60}$/;
    const errors = {};

    if (!values.wallet) {
      errors.wallet = 'Ooops! Your wallet is required';
      return errors;
    } else if (!addressExp.test(values.wallet)) {
      errors.wallet = 'Your wallet address is wrong. Check it one more time';
      return errors;
    } else {
      return HeliumAPI.getAccountForAddress(values.wallet)
        .then(account => {
          if (!account || !account.data || !account.data.data || !account.data.data.address || account.data.data.address !== values.wallet) {
            errors.wallet = 'Your wallet address is wrong. Check it one more time';
          }

          return HeliumAPI.getHotspotsForAccount(values.wallet);
        })
        .then(hses => {
          if (!hses || !hses.data || !hses.data.data || hses.data.data.length < 1) {
            errors.wallet = 'There are no hotspots on this wallet';
          }

          return errors;
        })
        .catch(err => {
          console.error(err);

          toast.error('Something went wrong with Helium API. Try one more time', {
            theme: 'dark'
          });
        });
    }
  }

  handleSubmit (values) {
    return HeliumAPI.getHotspotsForAccount(values.wallet)
      .then(hses => hses.data.data.map(res => {
        const hs = {};

        if (!res || !res.address) {
          toast.error('HS from list doesn\'t have an hotspot address. Helium API Error', { theme: 'dark' });

          return false;
        }

        let hsList = this.props.hsList;
        hsList = hsList.filter(hs => hs.value === res.address);

        if (hsList.length > 0) {
          toast.error(`Ooops! Hotspot ${hsList[0].label} is on the list`, { theme: 'dark' });
          return false;
        }

        hs.value = res.address;
        hs.label = HSName.toView(res.name);
        hs.data = res;

        return this.props.addHSToList(hs);
      }))
      .then(() => this.props.hideHSModal())
      .then(() => this.props.useHS(this.props.hsList.length - 1))
      .catch(err => {
        console.error(err);

        toast.error('Something went wrong with Helium API. Try one more time', {
          theme: 'dark'
        });
      });
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
              <button
                className='btn btn-md btn-decor'
                type='submit'
                disabled={submitting}
              >
                Submit
              </button>
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
