import { Field } from 'react-final-form';
import PropTypes from 'prop-types';
import React from 'react';

const Condition = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => (value === is ? children : null)}
  </Field>
);

Condition.propTypes = {
  when: PropTypes.string.isRequired,
  is: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired
};

export default Condition;
