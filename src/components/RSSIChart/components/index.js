import React from 'react';
import '../styles/RSSIChart.scss';
import PropTypes from 'prop-types';
import { BaseComponent, chartOptions, dateUtility, generateLegend, generateLabels, sendErrorToast } from '../../../utilities';
import { Bar } from 'react-chartjs-2';
import DayModal from '../../DayModal';

class RSSIChart extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      labels: [],
      data: [],
      daysDataset: [],
      loaded: false,
      dayModalShow: false,
      dayModalData: []
    };

    this.generateData = this.generateData.bind(this);
    this.handleDayModalHide = this.handleDayModalHide.bind(this);
  }

  componentDidMount () {
    generateLabels(this.props.config.min_time, this.props.config.max_time)
      .then(this.generateData)
      .catch(err => {
        console.error(err);
        sendErrorToast('Something went wrong with Helium API. Try one more time');
      })
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

    const earnings = this.props.earnings.map(reward => {
      reward.date = dateUtility(new Date(reward.timestamp));
      return reward;
    });

    const daysDataset = labels.map(day => {
      const dayData = data.filter(action => action.date === day);
      const earningsData = earnings.filter(r => r.date === day).map(r => r.amount);
      let dayReward;

      chartDataset[0].data.push(dayData.filter(w => w.signal < -130).length);
      chartDataset[1].data.push(dayData.filter(w => w.signal >= -130 && w.signal < -120).length);
      chartDataset[2].data.push(dayData.filter(w => w.signal >= -120 && w.signal < -110).length);
      chartDataset[3].data.push(dayData.filter(w => w.signal >= -110 && w.signal < -100).length);
      chartDataset[4].data.push(dayData.filter(w => w.signal >= -100 && w.signal < -90).length);
      chartDataset[5].data.push(dayData.filter(w => w.signal >= -90).length);

      try {
        dayReward = earningsData.reduce((p, c) => p + c);
      } catch (e) {
        dayReward = 0;
      }

      chartDataset[6].data.push(dayReward / 100000000);

      return dayData;
    });

    this.updateState({ labels, data: chartDataset, daysDataset, loaded: true });
  }

  generateChartDataset () {
    return [
      { label: 'RSSI < -130', backgroundColor: '#fd7f6f', stack: 'Stack 0', data: [], order: 1, yAxisID: 'dataAxis' },
      { label: '-130 ⋜ RSSI < -120', backgroundColor: '#ffb55a', stack: 'Stack 0', data: [], order: 1, yAxisID: 'dataAxis' },
      { label: '-120 ⋜ RSSI < -110', backgroundColor: '#ffee65', stack: 'Stack 0', data: [], order: 1, yAxisID: 'dataAxis' },
      { label: '-110 ⋜ RSSI < -100', backgroundColor: '#7eb0d5', stack: 'Stack 0', data: [], order: 1, yAxisID: 'dataAxis' },
      { label: '-100 ⋜ RSSI < -90', backgroundColor: '#8bd3c7', stack: 'Stack 0', data: [], order: 1, yAxisID: 'dataAxis' },
      { label: 'RSSI ⋝ -90', backgroundColor: '#b2e061', stack: 'Stack 0', data: [], order: 1, yAxisID: 'dataAxis' },
      { label: 'Earnings', backgroundColor: '#24564e', borderColor: '#a9dfd8', data: [], type: 'line', order: 0, yAxisID: 'earningsAxis' }
    ];
  }

  handleDayModalHide () {
    this.updateState({ dayModalShow: false });
  }

  render () {
    if (!this.state.loaded) {
      return null;
    }

    return (
      <React.Fragment>
        <div className='rssi-box'>
          <h2>RSSI Chart</h2>

          <Bar
            height={200}
            options={chartOptions((e, elements) => {
              try {
                const dayData = this.state.daysDataset[elements[0].index];
                this.updateState({ dayModalShow: true, dayModalData: dayData });
              } catch (e) {}
            })}
            data={{ labels: this.state.labels, datasets: this.state.data }}
          />

          <div className='rssi-box-legend space'>
            {generateLegend(this.state.data)}
          </div>
        </div>

        <DayModal mode='rssi' show={this.state.dayModalShow} data={this.state.dayModalData} onHide={this.handleDayModalHide} />
      </React.Fragment>
    );
  }
}

RSSIChart.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  hsList: PropTypes.array,
  currentHS: PropTypes.number,
  earnings: PropTypes.array
};

export default RSSIChart;
