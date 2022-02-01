import React from 'react';
import '../styles/InfoBlock.scss';
import PropTypes from 'prop-types';
import CountUp from 'react-countup';
import ReactPlaceholder from 'react-placeholder';

class InfoBlock extends React.Component {
  render () {
    return (
      <div className={'info-block' + (this.props.className ? ` ${this.props.className}` : '')}>
        <h3>{this.props.title}</h3>
        <p>
          <ReactPlaceholder type='text' rows={1} showLoadingAnimation color='#13151b' ready={this.props.number !== 0}>
            <CountUp
              start={0}
              end={this.props.number}
              duration={1}
            />
          </ReactPlaceholder>
        </p>
      </div>
    );
  }
}

InfoBlock.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  number: PropTypes.number
};

export default InfoBlock;
