import React from 'react';
import '../styles/BeaconsChart.scss';
import PropTypes from 'prop-types';
import { chartOptions, dateUtility } from '../../../utilities';
import { toast } from 'react-toastify';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

class BeaconsChart extends React.Component {
  constructor (props) {
    super(props);
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    this.state = {
      labels: [],
      data: [],
      loaded: false
    };

    this.generateLabels = this.generateLabels.bind(this);
    this.generateData = this.generateData.bind(this);
  }

  componentDidMount () {
    this.generateLabels()
      .then(this.generateData)
      .catch(err => {
        console.error(err);

        toast.error('Something went wrong with Helium API. Try one more time', {
          theme: 'dark'
        });
      })
  }

  generateLabels () {
    return new Promise(resolve => {
      const labels = [];
      const currentDate = new Date(this.props.config.min_time);
      const endDate = new Date(this.props.config.max_time);

      while (currentDate <= endDate) { // eslint-disable-line no-unmodified-loop-condition
        labels.push(dateUtility(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      this.setState({ ...this.state, labels }, () => resolve(labels));
    });
  }

  generateData (labels) {
    const chartDataset = this.generateChartDataset();

    const data = this.props.data.map(action => {
      action.date = dateUtility(new Date(action.time * 1000));
      return action;
    });

    labels.map(day => {
      const dayData = data.filter(action => action.date === day);
      let amount = 0;

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

      return day;
    });

    this.setState({ ...this.state, data: chartDataset, loaded: true });
  }

  generateChartDataset () {
    return [
      {
        label: 'Amount',
        backgroundColor: '#b2e061',
        data: []
      }
    ]
  }

  generateLegend (data) {
    return data.map((dataset, i) => {
      return (
        <div className='beacons-chart-legend-item' key={i}>
          <div className='beacons-chart-legend-item-box' style={{ backgroundColor: dataset.backgroundColor }} />
          <div className='beacons-chart-legend-item-label'>{dataset.label}</div>
        </div>
      );
    });
  }

  render () {
    if (!this.state.loaded) {
      return null;
    }

    return (
      <div className='beacons-chart'>
        <h2>Beacons Amount Chart</h2>

        <Bar
          options={chartOptions(() => {})}
          data={{ labels: this.state.labels, datasets: this.state.data }}
        />

        <div className='beacons-chart-legend'>
          {this.generateLegend(this.state.data)}
        </div>
      </div>
    );
  }
}

BeaconsChart.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object
};

export default BeaconsChart;
