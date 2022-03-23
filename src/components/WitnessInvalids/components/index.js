import React from 'react';
import '../styles/WitnessInvalids.scss';
import PropTypes from 'prop-types';

class WitnessInvalids extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  componentDidMount () {
    console.log(this.props.data, this.props.config);

    const wData = this.props.data.map(beacon => beacon.path[0].witnesses.length);
    const witnesses = {
      min: Math.min(...wData),
      max: Math.max(...wData),
      avg: (wData.reduce((a, b) => a + b, 0) / wData.length).toFixed(2),
      total: wData.reduce((a, b) => a + b, 0)
    };

    console.log(witnesses);

    const vData = this.props.data.map(beacon => beacon.path[0].witnesses);
    console.log(vData);
    // vData = vData.map(data => data.is_valid);
    //
    // const vDataT = vData.filter(x => x).length;
    // const vDataF = vData.filter(x => !x).length;
    //
    // console.log(vData, vDataT, vDataF);
  }

  render () {
    if (!this.state.loaded) {
      return null;
    }

    return (
      <div className='witness-invalids'>
        <h2>Witness / Invalids</h2>
      </div>
    );
  }
}

WitnessInvalids.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object
};

export default WitnessInvalids;
