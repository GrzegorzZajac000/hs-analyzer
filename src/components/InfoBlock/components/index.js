import React from 'react';
import '../styles/InfoBlock.scss';
import PropTypes from 'prop-types';
import CountUp from 'react-countup';
import { BaseComponent } from '../../../utilities';

class InfoBlock extends BaseComponent {
  render () {
    return (
      <div className={'info-block' + (this.props.className ? ` ${this.props.className}` : '')}>
        <h3>{this.props.title}</h3>
        <p>
          <CountUp
            start={0}
            end={this.props.number}
            prefix={this.props.prefix || ''}
            suffix={this.props.suffix || ''}
            duration={1}
            decimals={this.props.decimals || 0}
          />
        </p>
      </div>
    );
  }
}

InfoBlock.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  number: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  decimals: PropTypes.number
};

export default InfoBlock;
