import React from 'react';
import '../styles/InfoBlock.scss';
import PropTypes from 'prop-types';
import CountUp from 'react-countup';

class InfoBlock extends React.Component {
  render () {
    return (
      <div className='info-block'>
        <h2>{this.props.title}</h2>
        <p>
          <CountUp
            start={0}
            end={this.props.number}
            duration={1}
          />
        </p>
      </div>
    );
  }
}

InfoBlock.propTypes = {
  title: PropTypes.string,
  number: PropTypes.number
};

export default InfoBlock;
