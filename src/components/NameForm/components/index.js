import React from 'react';
import '../styles/NameForm.scss';
import { Form, Field } from 'react-final-form';
import AsyncSelect from 'react-select/async';

class NameForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      hotspotOptions: []
    }

    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validate () {
    console.log('validate');
  }

  handleSubmit (values) {
    console.log(values);
  }

  render () {
    return (
      <div className='name-form'>
        <Form onSubmit={(values) => this.handleSubmit(values)} validate={this.validate} render={({ handleSubmit, form, submitting, pristine, invalid, values }) => (
          <form onSubmit={(values) => handleSubmit(values)} id='name-form'>
            <div className='name-form-input'>
              <Field name='name'>
                {({ input, meta }) => (
                  <React.Fragment>
                    <label htmlFor='name'>Hotspot name</label>
                    <AsyncSelect
                      {...input}
                      placeholder='HS Name e.g. Satin Enjoyed Xerus'
                      className='react-select'
                      classNamePrefix='rs'
                      options={this.state.hotspotOptions}
                      autofocus
                      isSearchable
                    />
                    <p>{meta.submitFailed && meta.error}</p>
                  </React.Fragment>
                )}
              </Field>
            </div>
            <div className='name-form-days'>
              <h3>Date range</h3>
              <div className='name-form-days-buttons'>
                <Field name='days' type='radio' value='7'>
                  {({ input }) => (
                    <div className='input-radio-button'>
                      <input {...input} id='name-7-days' />
                      <label className='btn btn-sm btn-decor' htmlFor='name-7-days'>Last 7 days</label>
                    </div>
                  )}
                </Field>
                <Field name='days' type='radio' value='14'>
                  {({ input }) => (
                    <div className='input-radio-button'>
                      <input {...input} id='name-14-days' />
                      <label className='btn btn-sm btn-decor' htmlFor='name-14-days'>Last 14 days</label>
                    </div>
                  )}
                </Field>
                <Field name='days' type='radio' value='30'>
                  {({ input }) => (
                    <div className='input-radio-button'>
                      <input {...input} id='name-30-days' />
                      <label className='btn btn-sm btn-decor' htmlFor='name-30-days'>Last 30 days</label>
                    </div>
                  )}
                </Field>
                <Field name='days' type='radio' value='custom'>
                  {({ input }) => (
                    <div className='input-radio-button'>
                      <input {...input} id='name-custom-days' />
                      <label className='btn btn-sm btn-decor' htmlFor='name-custom-days'>Custom</label>
                    </div>
                  )}
                </Field>
              </div>
            </div>
            <div className='name-form-submit'>
              <button className='btn btn-md btn-decor' type='submit'>Submit</button>
            </div>
          </form>
        )}
        />
      </div>
    );
  }
}

export default NameForm;
