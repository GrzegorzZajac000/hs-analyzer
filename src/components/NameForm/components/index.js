import React from 'react';
import '../styles/NameForm.scss';
import { Form, Field } from 'react-final-form';
import AsyncSelect from 'react-select/async';
import HeliumAPI from '../../../api/HeliumAPI';
import PropTypes from 'prop-types';
import { BaseComponent, HSName, getOptionLabel } from '../../../utilities';
import { FormButton } from '../../';

class NameForm extends BaseComponent {
  constructor (props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
  }

  validate (values) {
    const addressExp = /^[a-zA-Z0-9]{40,60}$/;
    const errors = {};

    if (!values.hs) {
      errors.hs = 'Ooops! Your hotspot is required';
    } else if (!values.hs.data.address) {
      errors.hs = 'Ooops! Your hotspot address is required';
    } else if (!addressExp.test(values.hs.data.address)) {
      errors.hs = 'Your address is wrong. Check it one more time';
    } else {
      let hsList = this.props.hsList;

      if (!(typeof hsList === 'object' && !Array.isArray(hsList) && hsList !== null)) {
        hsList = [];
      }

      hsList = hsList.filter(hs => hs.value === values.hs.data.address);

      if (hsList.length > 0) {
        errors.hs = `Ooops! Your hotspot is on the list as ${hsList[0].label}`;
      }
    }

    return errors;
  }

  handleSubmit (values) {
    const hs = values.hs;
    hs.label = HSName.toView(hs.data.name);

    this.props.addHSToList(hs);
    this.props.hideHSModal();
    this.props.useHS(this.props.hsList.length - 1);
  }

  onNameChange (hsName, callback) {
    let name = hsName;

    if (name.length <= 2) {
      return false;
    }

    if (name.slice(-1) === ' ') {
      name = name.slice(0, -1);
    }

    return HeliumAPI.hotspotNameSearch(name.toLowerCase().replace(/\s/g, '-'))
      .then(hotspots => hotspots.data.data.map(hs => {
        return {
          label: `${HSName.toView(hs.name)} - ${hs.address.substr(0, 32)}...`,
          value: hs.address,
          data: hs
        };
      }))
      .then(hotspots => callback(hotspots));
  }

  render () {
    return (
      <div className='config-form'>
        <Form onSubmit={(values) => this.handleSubmit(values)} validate={this.validate} render={({ handleSubmit, form, submitting, pristine, invalid, values }) => (
          <form onSubmit={(values) => handleSubmit(values)} id='name-form'>
            <div className='config-form-input'>
              <Field name='hs'>
                {({ input, meta }) => (
                  <React.Fragment>
                    <label htmlFor='hs'>Hotspot name</label>
                    <AsyncSelect
                      {...input}
                      id='hs'
                      placeholder='HS Name e.g. Satin Enjoyed Xerus'
                      className='react-select'
                      classNamePrefix='rs'
                      loadOptions={this.onNameChange}
                      autoFocus
                      isSearchable
                      noOptionsMessage={() => 'Enter at least 3 characters'}
                      getOptionLabel={getOptionLabel}
                    />
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

NameForm.propTypes = {
  addHSToList: PropTypes.func,
  hideHSModal: PropTypes.func,
  hsList: PropTypes.array,
  useHS: PropTypes.func
};

export default NameForm;
