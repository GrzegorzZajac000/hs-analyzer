import React from 'react';
import '../styles/RSSIChart.scss';
import PropTypes from 'prop-types';
import { chartOptions, dateUtility } from '../../../utilities';
import { toast } from 'react-toastify';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

class RSSIChart extends React.Component {
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

    let data = this.props.data.map(action => {
      return action.path[0].witnesses.filter(witness => witness.gateway === this.props.hsList[this.props.currentHS].value);
    }).flat();

    data = data.map(action => {
      action.date = dateUtility(new Date(action.timestamp / 1000000));
      return action;
    });

    labels.map(day => {
      const dayData = data.filter(action => action.date === day);

      chartDataset[0].data.push(dayData.filter(w => w.signal < -130).length);
      chartDataset[1].data.push(dayData.filter(w => w.signal >= -130 && w.signal < -120).length);
      chartDataset[2].data.push(dayData.filter(w => w.signal >= -120 && w.signal < -110).length);
      chartDataset[3].data.push(dayData.filter(w => w.signal >= -110 && w.signal < -100).length);
      chartDataset[4].data.push(dayData.filter(w => w.signal >= -100 && w.signal < -90).length);
      chartDataset[5].data.push(dayData.filter(w => w.signal >= -90).length);

      return day;
    });

    this.setState({ ...this.state, data: chartDataset, loaded: true });
  }

  generateChartDataset () {
    return [
      {
        label: 'RSSI < -130',
        backgroundColor: '#fd7f6f',
        stack: 'Stack 0',
        data: []
      },
      {
        label: '-130 ⋜ RSSI < -120',
        backgroundColor: '#ffb55a',
        stack: 'Stack 0',
        data: []
      },
      {
        label: '-120 ⋜ RSSI < -110',
        backgroundColor: '#ffee65',
        stack: 'Stack 0',
        data: []
      },
      {
        label: '-110 ⋜ RSSI < -100',
        backgroundColor: '#7eb0d5',
        stack: 'Stack 0',
        data: []
      },
      {
        label: '-100 ⋜ RSSI < -90',
        backgroundColor: '#8bd3c7',
        stack: 'Stack 0',
        data: []
      },
      {
        label: 'RSSI ⋝ -90',
        backgroundColor: '#b2e061',
        stack: 'Stack 0',
        data: []
      }
    ];
  }

  generateLegend (data) {
    return data.map((dataset, i) => {
      return (
        <div className='rssi-chart-legend-item' key={i}>
          <div className='rssi-chart-legend-item-box' style={{ backgroundColor: dataset.backgroundColor }} />
          <div className='rssi-chart-legend-item-label'>{dataset.label}</div>
        </div>
      );
    });
  }

  render () {
    if (!this.state.loaded) {
      return null;
    }

    return (
      <div className='rssi-chart'>
        <h2>RSSI Chart</h2>

        <Bar
          options={chartOptions(() => {})}
          data={{ labels: this.state.labels, datasets: this.state.data }}
        />

        <div className='rssi-chart-legend'>
          {this.generateLegend(this.state.data)}
        </div>
      </div>
    );
  }
}

RSSIChart.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  hsList: PropTypes.array,
  currentHS: PropTypes.number
};

export default RSSIChart;
