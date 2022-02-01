import React from 'react';
import '../styles/AddressForm.scss';
import { Form, Field } from 'react-final-form';
import Calendar from 'react-calendar';

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
  }

  handleSubmit (values) {
    console.log(values);
  }

  render () {
    return (
      <div className='config-form'>
        <Form onSubmit={(values) => this.handleSubmit(values)} validate={this.validate} render={({ handleSubmit, form, submitting, pristine, invalid, values }) => (
          <form onSubmit={(values) => handleSubmit(values)} id='address-form'>
            <div className='config-form-input'>
              <Field type='text' name='address'>
                {({ input, meta }) => (
                  <React.Fragment>
                    <label htmlFor='address'>Hotspot name</label>
                    <input {...input} className='hs-input' id='address' placeholder='HS Address' autoFocus />
                    <p>{meta.submitFailed && meta.error}</p>
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
                  {({ input }) => (
                    <div className='input-radio-button'>
                      <input {...input} id='address-custom-days' />
                      <label className='btn btn-sm btn-decor' htmlFor='address-custom-days'>Custom</label>
                    </div>
                  )}
                </Field>
              </div>
            </div>
            <div className={'config-form-days-custom' + (this.state.customDate ? ' visible' : '')}>
              <h3>Select custom date range</h3>
              <Calendar
                defaultView='month'
                minDetail='month'
                selectRange
              />
            </div>
            <div className='config-form-submit'>
              <button className='btn btn-md btn-decor' type='submit'>Submit</button>
            </div>
          </form>
        )}
        />
      </div>
    );
  }
}

export default AddressForm;
