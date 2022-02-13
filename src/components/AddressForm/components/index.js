import React from 'react';
import '../styles/AddressForm.scss';
import { Form, Field } from 'react-final-form';
import HeliumAPI from '../../../api/HeliumAPI';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

class AddressForm extends React.Component {
  constructor (props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validate (values) {
    const addressExp = /^[a-zA-Z0-9]{40,60}$/;
    const errors = {};

    if (!values.address) {
      errors.address = 'Ooops! Your hotspot is required';
    } else if (!addressExp.test(values.address)) {
      errors.address = 'Your address is wrong. Check it one more time';
    }

    return errors;
  }

  handleSubmit (values) {
    return HeliumAPI.getHotspotForAddress(values.address)
      .then(res => this.props.setHsInfo(res.data.data))
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
              <Field type='text' name='address'>
                {({ input, meta }) => (
                  <React.Fragment>
                    <label htmlFor='address'>Hotspot address</label>
                    <input {...input} className='hs-input' id='address' placeholder='HS Address' autoFocus />
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

AddressForm.propTypes = {
  setHsInfo: PropTypes.func
};

export default AddressForm;
