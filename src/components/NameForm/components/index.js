import React from 'react';
import '../styles/NameForm.scss';
import { Form, Field } from 'react-final-form';
import AsyncSelect from 'react-select/async';
import HeliumAPI from '../../../api/HeliumAPI';
import Flag from 'react-world-flags';
import Calendar from 'react-calendar';

class NameForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      hotspotOptions: []
    }

    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
  }

  validate (values) {
    console.log('validate', values);
  }

  handleSubmit (values) {
    console.log(values);
  }

  onNameChange (name, callback) {
    if (name.length <= 2 || name.slice(-1) === ' ') {
      return false;
    }

    return HeliumAPI.hotspotNameSearch(name)
      .then(hotspots => {
        return hotspots.data.data.map((hs) => {
          let nameTemp = hs.name.split('-');

          nameTemp = nameTemp.map(name => name.charAt(0).toUpperCase() + name.slice(1));
          nameTemp = nameTemp.join(' ');

          return {
            label: (
              <React.Fragment>
                <Flag className='flag' code={hs.geocode.short_country} height={16} /> {nameTemp}
              </React.Fragment>
            ),
            value: nameTemp
          };
        });
      })
      .then(hotspots => callback(hotspots));
  }

  render () {
    return (
      <div className='config-form'>
        <Form onSubmit={(values) => this.handleSubmit(values)} validate={this.validate} render={({ handleSubmit, form, submitting, pristine, invalid, values }) => (
          <form onSubmit={(values) => handleSubmit(values)} id='name-form'>
            <div className='config-form-input'>
              <Field name='name'>
                {({ input, meta }) => (
                  <React.Fragment>
                    <label htmlFor='name'>Hotspot name</label>
                    <AsyncSelect
                      {...input}
                      id='name'
                      placeholder='HS Name e.g. Satin Enjoyed Xerus'
                      className='react-select'
                      classNamePrefix='rs'
                      loadOptions={this.onNameChange}
                      autoFocus
                      isSearchable
                      noOptionsMessage={() => 'Enter at least 3 characters'}
                    />
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
            <div className='config-form-days-custom'>
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

export default NameForm;
