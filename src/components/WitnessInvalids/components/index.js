import React from 'react';
import '../styles/WitnessInvalids.scss';
import PropTypes from 'prop-types';
import CountUp from 'react-countup';

class WitnessInvalids extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      witnesses: {},
      invalids: {}
    };
  }

  componentDidMount () {
    const wData = this.props.data.map(beacon => beacon.path[0].witnesses.length);
    const witnesses = {
      min: Math.min(...wData),
      max: Math.max(...wData),
      avg: (wData.reduce((a, b) => a + b, 0) / wData.length),
      total: wData.reduce((a, b) => a + b, 0)
    };

    let vData = this.props.data.map(beacon => beacon.path[0].witnesses);
    vData = vData.map(data => data.map(item => item.is_valid));
    vData = vData.map(data => data.filter(x => !x).length);

    const invalids = {
      min: Math.min(...vData),
      max: Math.max(...vData),
      avg: (vData.reduce((a, b) => a + b, 0) / vData.length),
      total: vData.reduce((a, b) => a + b, 0)
    };

    this.setState({ ...this.state, witnesses, invalids, loaded: true });
  }

  render () {
    if (!this.state.loaded) {
      return null;
    }

    return (
      <div className='rssi-box'>
        <h2>Witnesses</h2>

        <div className='rssi-box-container'>
          <div className='rssi-box-container-box'>
            <h3>Min</h3>
            <h4>
              <CountUp
                start={0}
                end={this.state.witnesses.min}
                duration={1}
              />
            </h4>
          </div>
          <div className='rssi-box-container-box'>
            <h3>Max</h3>
            <h4>
              <CountUp
                start={0}
                end={this.state.witnesses.max}
                duration={1}
              />
            </h4>
          </div>
          <div className='rssi-box-container-box'>
            <h3>Average</h3>
            <h4>
              <CountUp
                start={0}
                end={this.state.witnesses.avg}
                decimals={2}
                duration={1}
              />
            </h4>
          </div>
          <div className='rssi-box-container-box'>
            <h3>Total</h3>
            <h4>
              <CountUp
                start={0}
                end={this.state.witnesses.total}
                duration={1}
              />
            </h4>
          </div>
        </div>

        <h2>Invalids</h2>
        <div className='rssi-box-container'>
          <div className='rssi-box-container-box'>
            <h3>Min</h3>
            <h4>
              <CountUp
                start={0}
                end={this.state.invalids.min}
                duration={1}
              />
            </h4>
          </div>
          <div className='rssi-box-container-box'>
            <h3>Max</h3>
            <h4>
              <CountUp
                start={0}
                end={this.state.invalids.max}
                duration={1}
              />
            </h4>
          </div>
          <div className='rssi-box-container-box'>
            <h3>Average</h3>
            <h4>
              <CountUp
                start={0}
                end={this.state.invalids.avg}
                decimals={2}
                duration={1}
              />
            </h4>
          </div>
          <div className='rssi-box-container-box'>
            <h3>Total</h3>
            <h4>
              <CountUp
                start={0}
                end={this.state.invalids.total}
                duration={1}
              />
            </h4>
          </div>
        </div>
      </div>
    );
  }
}

WitnessInvalids.propTypes = {
  data: PropTypes.array
};

export default WitnessInvalids;
