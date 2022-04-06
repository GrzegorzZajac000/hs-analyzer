import React, { useState } from 'react';
import '../styles/DateConfigModal.scss';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { BaseComponent } from '../../../utilities';
import Calendar from 'react-calendar';
import { Form, Field } from 'react-final-form';

const CalendarComponent = props => {
  const calendarProps = props;
  const [date, setDate] = useState(calendarProps.value);
  return <Calendar {...calendarProps} onChange={(e) => { setDate(e); calendarProps.onChange(e); }} value={date} />;
};

class DateConfigModal extends BaseComponent {
  constructor (props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validate (values) {
    const errors = {};

    if (!values.days) {
      errors.days = 'Ooops! Date range is required. Choose one';
    }

    if (values.days === 'custom') {
      if (!values['custom-dates-calendar'] || values['custom-dates-calendar'].length < 2) {
        errors.days = 'Ooops! Please select custom date range';
      }
    }

    return errors;
  }

  handleSubmit (values) {
    this.props.setDateMode(values.days);

    if (values.days === 'custom') {
      this.props.setMinTime(values['custom-dates-calendar'][0].toISOString());
      this.props.setMaxTime(values['custom-dates-calendar'][1].toISOString());
    }

    this.props.onHide();
    return true;
  }

  render () {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop
        keyboard
      >
        <div className='date-config-modal'>
          <h2>Date config</h2>

          <div className='date-config-form'>
            <Form initialValues={{ days: this.props.dateMode, 'custom-dates-calendar': [new Date(this.props.minTime), new Date(this.props.maxTime)] }} onSubmit={values => this.handleSubmit(values)} validate={this.validate} render={({ handleSubmit, form, submitting, pristine, invalid, values }) => (
              <form onSubmit={values => handleSubmit(values)}>
                <div className='date-config-form-days'>
                  <h3>Date range</h3>
                  <div className='date-config-form-days-buttons'>
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
                <div className='date-config-form-days-custom'>
                  <h3>If custom, select date range</h3>
                  <Field name='custom-dates-calendar'>
                    {({ input, meta }) => (
                      <React.Fragment>
                        <CalendarComponent {...input} defaultView='month' minDetail='month' selectRange />
                        <p className='input-error'>{meta.submitFailed && meta.error}</p>
                      </React.Fragment>
                    )}
                  </Field>
                </div>
                <div className='date-config-form-buttons'>
                  <button
                    className='btn btn-md btn-warning'
                    type='button'
                    onClick={this.props.onHide}
                  >
                    Cancel
                  </button>
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
        </div>
      </Modal>
    );
  }
}

DateConfigModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  setDateMode: PropTypes.func,
  setMinTime: PropTypes.func,
  setMaxTime: PropTypes.func,
  dateMode: PropTypes.string,
  minTime: PropTypes.string,
  maxTime: PropTypes.string
};

export default DateConfigModal;
