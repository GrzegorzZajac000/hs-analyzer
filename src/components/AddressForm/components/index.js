import React from 'react';
import '../styles/AddressForm.scss';
import { Form, Field } from 'react-final-form';
import HeliumAPI from '../../../api/HeliumAPI';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import HSName from '../../../utilities/HSName';
import Flag from 'react-world-flags';

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
    } else {
      let hsList = this.props.hsList;
      hsList = hsList.filter(hs => hs.value === values.address);

      if (hsList.length > 0) {
        errors.address = `Ooops! Your hotspot is on the list as ${hsList[0].label}`;
      }
    }

    return errors;
  }

  handleSubmit (values) {
    return HeliumAPI.getHotspotForAddress(values.address)
      .then(res => {
        const hs = {};
        hs.value = res.data.data.address;
        hs.label = (
          <React.Fragment>
            <Flag className='flag' code={res.data.data.geocode.short_country} height={16} /> {HSName.toView(res.data.data.name)}
          </React.Fragment>
        );
        hs.data = res.data.data;

        return this.props.addHSToList(hs);
      })
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
  addHSToList: PropTypes.func,
  hideHSModal: PropTypes.func,
  hsList: PropTypes.array,
  useHS: PropTypes.func
};

export default AddressForm;
