import React from 'react';
import '../styles/WitnessInvalids.scss';
import PropTypes from 'prop-types';
import CountUp from 'react-countup';
import { BaseComponent } from '../../../utilities';

class WitnessInvalids extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      witnesses: {},
      invalids: {},
      rssiGroups: [],
      rssiTotal: 0
    };
  }

  componentDidMount () {
    const rData = this.props.witnessedData.map(action => {
      if (!action || !action.path || !action.path[0] || !action.path[0].witnesses) {
        return [];
      }

      return action?.path[0]?.witnesses?.filter(witness => witness.gateway === this.props.hsList[this.props.currentHS].value);
    }).flat();

    const rssiGroups = [
      rData.filter(w => w.signal < -130).length,
      rData.filter(w => w.signal >= -130 && w.signal < -120).length,
      rData.filter(w => w.signal >= -120 && w.signal < -110).length,
      rData.filter(w => w.signal >= -110 && w.signal < -100).length,
      rData.filter(w => w.signal >= -100 && w.signal < -90).length,
      rData.filter(w => w.signal >= -90).length
    ];

    const rssiTotal = rssiGroups.reduce((a, b) => a + b, 0)

    const wData = this.props.sentData.map(beacon => beacon.path[0].witnesses.length);

    const witnesses = {
      min: wData.length > 0 ? Math.min(...wData) : 0,
      max: wData.length > 0 ? Math.max(...wData) : 0,
      avg: (wData.reduce((a, b) => a + b, 0) / wData.length),
      total: wData.reduce((a, b) => a + b, 0)
    };

    let vData = this.props.sentData.map(beacon => beacon.path[0].witnesses);
    vData = vData.map(data => data.map(item => item.is_valid));
    vData = vData.map(data => data.filter(x => !x).length);

    const invalids = {
      min: vData.length > 0 ? Math.min(...vData) : 0,
      max: vData.length > 0 ? Math.max(...vData) : 0,
      avg: (vData.reduce((a, b) => a + b, 0) / vData.length),
      total: vData.reduce((a, b) => a + b, 0)
    };

    this.updateState({ witnesses, invalids, rssiGroups, rssiTotal, loaded: true });
  }

  render () {
    if (!this.state.loaded) {
      return null;
    }

    return (
      <div className='rssi-box witness-invalids'>
        <div className='rssi-box-columns'>
          <div>
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
          </div>
          <div>
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
          <div>
            <h2>RSSI Stats</h2>
            <div className='rssi-box-container'>
              <div className='rssi-box-container-box small rssi-stats-5'>
                <h4>
                  <CountUp start={0} end={this.state.rssiGroups[5]} duration={1} />
                </h4>
                <h5>
                  <CountUp start={0} end={this.state.rssiGroups[5] / this.state.rssiTotal} duration={1} decimals={2} suffix=' %' />
                </h5>
                <h6>RSSI &#8925; -90</h6>
              </div>
              <div className='rssi-box-container-box small rssi-stats-4'>
                <h4>
                  <CountUp start={0} end={this.state.rssiGroups[4]} duration={1} />
                </h4>
                <h5>
                  <CountUp start={0} end={this.state.rssiGroups[4] / this.state.rssiTotal * 100} duration={1} decimals={2} suffix=' %' />
                </h5>
                <h6>-100 &#8924; RSSI &lt; -90</h6>
              </div>
              <div className='rssi-box-container-box small rssi-stats-3'>
                <h4>
                  <CountUp start={0} end={this.state.rssiGroups[3]} duration={1} />
                </h4>
                <h5>
                  <CountUp start={0} end={this.state.rssiGroups[3] / this.state.rssiTotal * 100} duration={1} decimals={2} suffix=' %' />
                </h5>
                <h6>-110 &#8924; RSSI &lt; -100</h6>
              </div>
              <div className='rssi-box-container-box small rssi-stats-2'>
                <h4>
                  <CountUp start={0} end={this.state.rssiGroups[2]} duration={1} />
                </h4>
                <h5>
                  <CountUp start={0} end={this.state.rssiGroups[2] / this.state.rssiTotal * 100} duration={1} decimals={2} suffix=' %' />
                </h5>
                <h6>-120 &#8924; RSSI &lt; -110</h6>
              </div>
              <div className='rssi-box-container-box small rssi-stats-1'>
                <h4>
                  <CountUp start={0} end={this.state.rssiGroups[1]} duration={1} />
                </h4>
                <h5>
                  <CountUp start={0} end={this.state.rssiGroups[1] / this.state.rssiTotal * 100} duration={1} decimals={2} suffix=' %' />
                </h5>
                <h6>-130 &#8924; RSSI &lt; -120</h6>
              </div>
              <div className='rssi-box-container-box small rssi-stats-0'>
                <h4>
                  <CountUp start={0} end={this.state.rssiGroups[0]} duration={1} />
                </h4>
                <h5>
                  <CountUp start={0} end={this.state.rssiGroups[0] / this.state.rssiTotal * 100} duration={1} decimals={2} suffix=' %' />
                </h5>
                <h6>RSSI &lt; -130</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WitnessInvalids.propTypes = {
  sentData: PropTypes.array,
  witnessedData: PropTypes.array,
  hsList: PropTypes.array,
  currentHS: PropTypes.number
};

export default WitnessInvalids;
