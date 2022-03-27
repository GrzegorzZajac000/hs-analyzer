import React from 'react';
import '../styles/DayModal.scss';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { X } from 'react-bootstrap-icons';
import { BaseComponent, chartOptions } from '../../../utilities';
import { Bar } from 'react-chartjs-2';

class DayModal extends BaseComponent {
  constructor (props) {
    super(props);

    this.generateDayChart = this.generateDayChart.bind(this);
  }

  generateChartDataset () {
    switch (this.props.mode) {
    case 'rssi': {
      return [
        { label: 'RSSI < -130', backgroundColor: '#fd7f6f', stack: 'Stack 0', data: [], order: 1, yAxisID: 'dataAxis' },
        { label: '-130 ⋜ RSSI < -120', backgroundColor: '#ffb55a', stack: 'Stack 0', data: [], order: 1, yAxisID: 'dataAxis' },
        { label: '-120 ⋜ RSSI < -110', backgroundColor: '#ffee65', stack: 'Stack 0', data: [], order: 1, yAxisID: 'dataAxis' },
        { label: '-110 ⋜ RSSI < -100', backgroundColor: '#7eb0d5', stack: 'Stack 0', data: [], order: 1, yAxisID: 'dataAxis' },
        { label: '-100 ⋜ RSSI < -90', backgroundColor: '#8bd3c7', stack: 'Stack 0', data: [], order: 1, yAxisID: 'dataAxis' },
        { label: 'RSSI ⋝ -90', backgroundColor: '#b2e061', stack: 'Stack 0', data: [], order: 1, yAxisID: 'dataAxis' }
      ];
    }

    case 'beacons': {
      return [
        { label: 'Amount', backgroundColor: '#b2e061', data: [], order: 1, yAxisID: 'dataAxis' }
      ];
    }

    case 'beacons-valid': {
      return [
        { label: 'Invalid', backgroundColor: '#fd7f6f', stack: 'Stack 0', data: [], order: 1, yAxisID: 'dataAxis' },
        { label: 'Valid', backgroundColor: '#b2e061', stack: 'Stack 0', data: [], order: 1, yAxisID: 'dataAxis' }
      ]
    }
    }
  }

  generateDayChart () {
    if (!this.props || !this.props.data || this.props.data.length <= 0) {
      return null;
    }

    const chartDataset = this.generateChartDataset()

    const day = this.props.data[0].date;
    const labels = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

    labels.map((day, i) => {
      let dayData;

      switch (this.props.mode) {
      case 'rssi': {
        dayData = this.props.data.filter(action => new Date(action.timestamp / 1000).getHours() === i);

        chartDataset[0].data.push(dayData.filter(w => w.signal < -130).length);
        chartDataset[1].data.push(dayData.filter(w => w.signal >= -130 && w.signal < -120).length);
        chartDataset[2].data.push(dayData.filter(w => w.signal >= -120 && w.signal < -110).length);
        chartDataset[3].data.push(dayData.filter(w => w.signal >= -110 && w.signal < -100).length);
        chartDataset[4].data.push(dayData.filter(w => w.signal >= -100 && w.signal < -90).length);
        chartDataset[5].data.push(dayData.filter(w => w.signal >= -90).length);

        break;
      }

      case 'beacons': {
        let amount = 0;
        dayData = this.props.data.filter(action => new Date(action.time * 1000).getHours() === i);

        if (!Array.isArray(dayData) || dayData.length <= 0) {
          chartDataset[0].data.push(0);
        } else {
          dayData.map(action => {
            try {
              amount += action.path[0].witnesses.length;
            } catch (e) {
              amount += 0;
            }

            return action;
          });

          chartDataset[0].data.push(amount);
        }

        break;
      }

      case 'beacons-valid': {
        let invalid = 0;
        let valid = 0;
        dayData = this.props.data.filter(action => new Date(action.time * 1000).getHours() === i);

        if (!Array.isArray(dayData) || dayData.length <= 0) {
          chartDataset[0].data.push(0);
          chartDataset[1].data.push(0);
        } else {
          dayData.map(action => {
            if (action.path[0].witnesses.length <= 0) {
              invalid++;
            }

            if (action.path[0].witnesses.length > 0) {
              valid++;
            }

            return dayData;
          });

          chartDataset[0].data.push(invalid);
          chartDataset[1].data.push(valid);
        }

        break;
      }
      }

      return dayData;
    });

    return (
      <React.Fragment>
        <h2>{day}</h2>

        <Bar
          options={chartOptions(() => {}, { earnings: false })}
          data={{ labels, datasets: chartDataset }}
        />
      </React.Fragment>
    );
  }

  render () {
    return (
      <Modal
        className='day-modal'
        show={this.props.show}
        onHide={this.props.onHide}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop
        keyboard
      >
        <button className='hs-info-modal-close' onClick={this.props.onHide}>
          <X />
        </button>

        {this.generateDayChart()}
      </Modal>
    );
  }
}

DayModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  data: PropTypes.array,
  mode: PropTypes.string
};

export default DayModal;
