import React from 'react';
import '../styles/BeaconsValidChart.scss';
import PropTypes from 'prop-types';
import { chartOptions, dateUtility } from '../../../utilities';
import { toast } from 'react-toastify';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

class BeaconsValidChart extends React.Component {
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

    console.log(chartDataset);

    this.setState({ ...this.state, data: chartDataset, loaded: true });
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

  generateLegend (data) {
    return data.map((dataset, i) => {
      return (
        <div className='beacons-valid-chart-legend-item' key={i}>
          <div className='beacons-valid-chart-legend-item-box' style={{ backgroundColor: dataset.backgroundColor }} />
          <div className='beacons-valid-chart-legend-item-label'>{dataset.label}</div>
        </div>
      );
    });
  }

  render () {
    if (!this.state.loaded) {
      return null;
    }

    return (
      <div className='beacons-valid-chart'>
        <h2>Beacons Valid Chart</h2>

        <Bar
          options={chartOptions(() => {})}
          data={{ labels: this.state.labels, datasets: this.state.data }}
        />

        <div className='beacons-valid-chart-legend'>
          {this.generateLegend(this.state.data)}
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
