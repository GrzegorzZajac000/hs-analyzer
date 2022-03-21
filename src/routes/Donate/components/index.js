import React from 'react';
import '../styles/Donate.scss';
import QRCode from 'react-qr-code';
import DonateAddress from '../../../components/DonateAddress';
import HeliumAPI from '../../../api/HeliumAPI';
import { toast } from 'react-toastify';
import Flag from 'react-world-flags';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { arrayUnique } from '../../../utilities';

ChartJS.register(ArcElement, Tooltip, Legend);

class Donate extends React.Component {
  constructor (props) {
    super(props);

    let minTime = new Date().setDate(new Date().getDate() - 30);
    minTime = new Date(minTime).setMinutes(0);
    minTime = new Date(minTime).setSeconds(0);
    minTime = new Date(minTime).setMilliseconds(0);

    let maxTime = new Date().setHours(new Date().getHours() + 1);
    maxTime = new Date(maxTime).setMinutes(0);
    maxTime = new Date(maxTime).setSeconds(0);
    maxTime = new Date(maxTime).setMilliseconds(0);

    this.state = {
      qr: {
        type: 'payment',
        address: '14aJz2XEweHeLW4PLddJuumBuDfVW9XwRZemn35PYu3GUBiuJcc',
        amount: '0.1',
        memo: 'THX'
      },
      config: {
        min_time: new Date(minTime).toISOString(),
        max_time: new Date(maxTime).toISOString(),
        filter_types: 'payment_v1,payment_v2'
      },
      donates: []
    };

    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.generateDonatesArray = this.generateDonatesArray.bind(this);
    this.generateDataChart = this.generateDataChart.bind(this);
  }

  componentDidMount () {
    let donatesArr = [];

    return HeliumAPI.getRolesForAccount(
      '14aJz2XEweHeLW4PLddJuumBuDfVW9XwRZemn35PYu3GUBiuJcc',
      () => {},
      this.state.config
    ).then(donates => donates.map(donate => HeliumAPI.getTransactionForHash(donate.hash)))
      .then(promises => Promise.all(promises))
      .then(donates => donates.map(donate => donate.data.data))
      .then(donates => {
        donatesArr = donates;
        return donates.map(donate => HeliumAPI.getHotspotsForAccount(donate.payer));
      }).then(promises => Promise.all(promises))
      .then(hotspots => hotspots.map(hs => hs.data.data))
      .then(hotspots => hotspots.map(hs => (hs[0] && hs[0].geocode && hs[0].geocode.short_country && hs[0].geocode.long_country) ? { long_country: hs[0].geocode.long_country, short_country: hs[0].geocode.short_country } : 'Unknown'))
      .then(countries => countries.map((geocode, i) => {
        donatesArr[i].country = geocode.short_country;
        donatesArr[i].long_country = geocode.long_country;
        return geocode;
      }))
      .then(() => {
        this.setState({ ...this.state, donates: donatesArr });
      })
      .catch(err => {
        console.error(err);

        toast.error('Something went wrong with Helium API. Try one more time', {
          theme: 'dark'
        });
      });
  }

  handleAmountChange (e) {
    const qr = this.state.qr;
    qr.amount = e.target.value;

    this.setState({ ...this.state, qr });
  }

  generateDonatesArray () {
    if (this.state.donates.length <= 0) {
      return (
        <section className='donate-table-loading'>
          <div className='preload show-preloader'>
            <div className='preload-circle'>
              <div />
              <div />
            </div>
          </div>
        </section>
      );
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Payer</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {this.generateDonatesRows(this.state.donates)}
        </tbody>
      </table>
    );
  }

  generateDonatesRows (donates) {
    return donates.map((donate, i) => {
      return (
        <tr key={i}>
          <td>
            <Flag className='flag' code={donate.country} height={16} />
          </td>
          <td>{donate.payer}</td>
          <td>{(donate.payments[0].amount / 100000000).toFixed(2)} HNT</td>
        </tr>
      );
    });
  }

  generateDataChart () {
    const labels = this.state.donates.map(donate => donate.long_country).filter(arrayUnique);
    const dataset = new Array(labels.length).fill(0);

    this.state.donates.map(donate => {
      dataset[labels.indexOf(donate.long_country)] += Math.round(((donate.payments[0].amount / 100000000) + Number.EPSILON) * 100) / 100;
      return donate;
    });

    const data = {
      labels,
      datasets: [
        {
          label: 'HNT',
          data: dataset,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)'
          ],
          borderColor: '#1b1c26',
          borderWidth: 1
        }
      ]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      }
    };

    return <Pie data={data} options={options} />;
  }

  render () {
    return (
      <section className='donate route-section'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-6'>
              <h2>Donate</h2>
              <p>Here you can buy me a coffee with a donate in HNT. Scan QR code below or copy wallet address and make donate.</p>
              <p>If you are doing it manually, use comma not dot. There is no minimum amount and donation isn't required to access all the features of this tool.</p>

              <div className='donate-content'>
                <div className='donate-qr'>
                  <div className='donate-qr-box'>
                    <QRCode value={JSON.stringify(this.state.qr)} size={256} level='L' />
                  </div>
                </div>

                <div className='donate-amount'>
                  <label htmlFor='hnt-amount'>HNT Amount</label>
                  <input className='hs-input hs-input-donate' type='number' id='hnt-amount' value={this.state.qr.amount} onChange={this.handleAmountChange} step='0.01' min='0.01' />
                </div>

                <p className='donate-wallet'>Wallet address:</p>
                <DonateAddress />
              </div>
            </div>
            <div className='col-6'>
              <p className='donate-thank-you'>Thank to donators from last 30 days</p>
              <div className='donate-history'>
                {this.generateDonatesArray()}
              </div>
              <div className='donate-chart'>
                {this.generateDataChart()}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Donate;
