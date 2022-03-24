import React from 'react';
import '../styles/BeaconsValidChart.scss';
import PropTypes from 'prop-types';
import { chartOptions, dateUtility, generateLegend, generateLabels } from '../../../utilities';
import { toast } from 'react-toastify';
import { Bar } from 'react-chartjs-2';

class BeaconsValidChart extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      labels: [],
      data: [],
      loaded: false
    };

    this.generateData = this.generateData.bind(this);
  }

  componentDidMount () {
    generateLabels(this.props.config.min_time, this.props.config.max_time)
      .then(this.generateData)
      .catch(err => {
        console.error(err);

        toast.error('Something went wrong with Helium API. Try one more time', {
          theme: 'dark'
        });
      })
  }

  generateData (labels) {
    const chartDataset = this.generateChartDataset();

    const data = this.props.data.map(action => {
      action.date = dateUtility(new Date(action.time * 1000));
      return action;
    });

    labels.map(day => {
      const dayData = data.filter(action => action.date === day);
      let invalid = 0;
      let valid = 0;

      if (!Array.isArray(dayData) || dayData.length <= 0) {
        chartDataset[0].data.push(0);
        chartDataset[1].data.push(0);
      }

      dayData.map(action => {
        if (action.path[0].witnesses.length <= 0) {
          invalid++;
        }

        if (action.path[0].witnesses.length > 0) {
          valid++;
        }

        return action;
      });

      chartDataset[0].data.push(invalid);
      chartDataset[1].data.push(valid);

      return day;
    });

    this.setState({ ...this.state, labels, data: chartDataset, loaded: true });
  }

  generateChartDataset () {
    return [
      {
        label: 'Invalid',
        backgroundColor: '#fd7f6f',
        stack: 'Stack 0',
        data: []
      },
      {
        label: 'Valid',
        backgroundColor: '#b2e061',
        stack: 'Stack 0',
        data: []
      }
    ]
  }

  render () {
    if (!this.state.loaded) {
      return null;
    }

    return (
      <div className='rssi-box'>
        <h2>Beacons Valid Chart</h2>

        <Bar
          options={chartOptions(() => {})}
          data={{ labels: this.state.labels, datasets: this.state.data }}
        />

        <div className='rssi-box-legend'>
          {generateLegend(this.state.data)}
        </div>
      </div>
    );
  }
}

BeaconsValidChart.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object
};

export default BeaconsValidChart;
