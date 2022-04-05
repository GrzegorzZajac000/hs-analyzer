import React from 'react';
import '../styles/FormButton.scss';
import PropTypes from 'prop-types';
import { BaseComponent } from '../../../utilities';

class FormButton extends BaseComponent {
  render () {
    return (
      <button
        type={this.props.type}
        className={'form-button' + (this.props.className ? ` ${this.props.className}` : '')}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
      >
        <span className='form-button-children'>{this.props.children}</span>
        <span className='form-button-loader'>
          <div className='form-button-loader-spinner'>
            <div />
            <div />
            <div />
            <div />
          </div>
        </span>
      </button>
    );
  }
}

FormButton.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
};

export default FormButton;
