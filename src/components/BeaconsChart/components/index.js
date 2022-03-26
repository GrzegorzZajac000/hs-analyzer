import React from 'react';
import '../styles/BeaconsChart.scss';
import PropTypes from 'prop-types';
import { chartOptions, dateUtility, generateLegend, generateLabels } from '../../../utilities';
import { toast } from 'react-toastify';
import { Bar } from 'react-chartjs-2';

class BeaconsChart extends React.Component {
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

    const earnings = this.props.earnings.map(reward => {
      reward.date = dateUtility(new Date(reward.timestamp));
      return reward;
    });

    labels.map(day => {
      const dayData = data.filter(action => action.date === day);
      const earningsData = earnings.filter(r => r.date === day).map(r => r.amount);
      let amount = 0;
      let dayReward = 0;

      if (!Array.isArray(dayData) || dayData.length <= 0) {
        chartDataset[0].data.push(0);
      }

      dayData.map(action => {
        try {
          amount += action.path[0].witnesses.length;
        } catch (e) {
          amount += 0;
        }

        return action;
      });

      chartDataset[0].data.push(amount);

      try {
        dayReward = earningsData.reduce((p, c) => p + c);
      } catch (e) {
        dayReward = 0;
      }

      chartDataset[1].data.push(dayReward / 100000000);

      return day;
    });

    this.setState({ ...this.state, labels, data: chartDataset, loaded: true });
  }

  generateChartDataset () {
    return [
      { label: 'Amount', backgroundColor: '#b2e061', data: [], order: 1, yAxisID: 'dataAxis' },
      { label: 'Earnings', backgroundColor: '#a9dfd8', borderColor: '#a9dfd8', data: [], type: 'line', order: 0, yAxisID: 'earningsAxis' }
    ]
  }

  render () {
    if (!this.state.loaded) {
      return null;
    }

    return (
      <div className='rssi-box'>
        <h2>Beacons Amount Chart</h2>

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

BeaconsChart.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  earnings: PropTypes.array
};

export default BeaconsChart;
