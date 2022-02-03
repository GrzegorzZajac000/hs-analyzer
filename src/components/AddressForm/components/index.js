import React, { useState } from 'react';
import '../styles/AddressForm.scss';
import { Form, Field } from 'react-final-form';
import Calendar from 'react-calendar';
import HeliumAPI from '../../../api/HeliumAPI';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const CalendarComponent = props => {
  const calendarProps = props;
  const [date, setDate] = useState(calendarProps.value);
  return <Calendar {...calendarProps} onChange={(e) => { setDate(e); calendarProps.onChange(e); }} value={date} />;
};

class AddressForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      customDate: false
    };

    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validate (values) {
    console.log('validate', values);

    if (values.days) {
      this.setState({ ...this.state, customDate: values.days === 'custom' });
    }

    const addressExp = /^[a-zA-Z0-9]{40,60}$/;
    const errors = {};

    if (!values.address) {
      errors.address = 'Ooops! Your hotspot is required';
    } else if (!addressExp.test(values.address)) {
      errors.address = 'Your address is wrong. Check it one more time';
    }

    if (!values.days) {
      errors.days = 'Ooops! Date range is required. Choose one';
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
            <div className='config-form-days'>
              <h3>Date range</h3>
              <div className='config-form-days-buttons'>
                <Field name='days' type='radio' value='7'>
                  {({ input }) => (
                    <div className='input-radio-button'>
                      <input {...input} id='address-7-days' />
                      <label className='btn btn-sm btn-decor' htmlFor='address-7-days'>Last 7 days</label>
                    </div>
                  )}
                </Field>
                <Field name='days' type='radio' value='14'>
                  {({ input }) => (
                    <div className='input-radio-button'>
                      <input {...input} id='address-14-days' />
                      <label className='btn btn-sm btn-decor' htmlFor='address-14-days'>Last 14 days</label>
                    </div>
                  )}
                </Field>
                <Field name='days' type='radio' value='30'>
                  {({ input }) => (
                    <div className='input-radio-button'>
                      <input {...input} id='address-30-days' />
                      <label className='btn btn-sm btn-decor' htmlFor='address-30-days'>Last 30 days</label>
                    </div>
                  )}
                </Field>
                <Field name='days' type='radio' value='custom'>
                  {({ input, meta }) => (
                    <React.Fragment>
                      <div className='input-radio-button'>
                        <input {...input} id='address-custom-days' />
                        <label className='btn btn-sm btn-decor' htmlFor='address-custom-days'>Custom</label>
                      </div>
                      <p className='input-error'>{meta.submitFailed && meta.error}</p>
                    </React.Fragment>
                  )}
                </Field>
              </div>
            </div>
            <div className={'config-form-days-custom' + (this.state.customDate ? ' visible' : '')}>
              <h3>Select custom date range</h3>
              <Field name='custom-dates-calendar'>
                {({ input, meta }) => (
                  <React.Fragment>
                    <CalendarComponent {...input} value={[new Date(new Date().setDate(new Date().getDate() - 7)), new Date()]} defaultView='month' minDetail='month' selectRange />
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
