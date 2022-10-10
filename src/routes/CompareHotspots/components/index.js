import React from 'react';
import '../styles/CompareHotspots.scss';
import { BaseComponent, generateDateConfig, HSName, isCurrentHS, sendErrorToast } from '../../../utilities';
import { Navigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import HeliumAPI from '../../../api/HeliumAPI';
import { captureException } from '@sentry/react';
import { Field, Form } from 'react-final-form';
import { FormButton } from '../../../components';

class CompareHotspots extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      data_1: [],
      data_2: [],
      compareBoth: [],
      compareA: [],
      compareB: [],
      dataLoadingLength: 0,
      comparableHotspot: null,
      config: {
        ...generateDateConfig(this.props.dateMode, this.props.minTime, this.props.maxTime),
        filter_types: 'poc_receipts_v1,poc_receipts_v2'
      }
    };

    this.columns = [
      { name: 'Address', selector: row => row.address }
    ];

    this.getHSActivity = this.getHSActivity.bind(this);
    this.handleDataLoadingUpdate = this.handleDataLoadingUpdate.bind(this);
    this.generateSecondHotspotData = this.generateSecondHotspotData.bind(this);
    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateDiffs = this.generateDiffs.bind(this);
  }

  componentDidMount () {
    this.getHSActivity()
      .then(() => {});
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.currentHS !== this.props.currentHS && this.props.currentHS === null) {
      this.updateState({ loaded: false, data_1: [], data_2: [], compareBoth: [], compareA: [], compareB: [], dataLoadingLength: 0, comparableHotspot: null });
    }

    if (
      (
        prevProps.dateMode !== this.props.dateMode ||
        prevProps.minTime !== this.props.minTime ||
        prevProps.maxTime !== this.props.maxTime
      ) || (
        prevProps.currentHS !== this.props.currentHS &&
        this.props.currentHS !== null
      ) || (
        prevProps.hsList.length !== this.props.hsList.length &&
        this.props.currentHS !== null
      )
    ) {
      this.updateState({
        loaded: false,
        dataLoadingLength: 0,
        config: {
          ...generateDateConfig(this.props.dateMode, this.props.minTime, this.props.maxTime),
          filter_types: 'poc_receipts_v1, poc_receipts_v2'
        }
      }, () => {
        this.getHSActivity().then(() => {});
      });
    }
  }

  getHSActivity () {
    if (!isCurrentHS(this.props.currentHS) || this.props.hsList.length <= 0 || !this.props.hsList[this.props.currentHS].data.address) {
      return null;
    }

    return HeliumAPI.getHotspotChallenges(
      this.props.hsList[this.props.currentHS].data.address,
      this.handleDataLoadingUpdate,
      this.state.config
    ).then(res => {
      if (!isCurrentHS(this.props.currentHS) || this.props.hsList.length <= 0 || !this.props.hsList[this.props.currentHS].data.address) {
        return null;
      }

      const witnessedBeacon = {};
      const addr = this.props.hsList[this.props.currentHS].data.address;

      res.map(action => {
        try {
          const witnesses = action.path[0].witnesses;

          if (witnesses && Array.isArray(witnesses) && witnesses.length > 0) {
            witnesses.map(witness => {
              if (witness.gateway === addr) {
                if (!Array.isArray(witnessedBeacon[action.path[0].challengee])) {
                  witnessedBeacon[action.path[0].challengee] = [];

                  witnessedBeacon[action.path[0].challengee].push({
                    lat: action.path[0].challengee_lat,
                    lon: action.path[0].challengee_lon
                  });
                }

                witnessedBeacon[action.path[0].challengee].push(witness);
              }

              return witness;
            });
          }
        } catch (e) {}

        return action;
      });

      return witnessedBeacon;
    }).then(wB => {
      const data = [];

      Object.keys(wB).map(key => {
        const obj = { address: key };
        data.push(obj);

        return key;
      });

      this.updateState({ data_1: data, data_2: [], compareBoth: [], compareA: [], compareB: [], comparableHotspot: null, loaded: true });
    }).catch(err => {
      console.error(err);
      captureException(err);
      sendErrorToast('Something went wrong with Helium API. Try one more time');
    });
  }

  handleDataLoadingUpdate (dataLoadingLength) {
    this.updateState({ dataLoadingLength });
  }

  validate (values) {
    const addressExp = /^[a-zA-Z0-9]{40,60}$/;
    const errors = {};

    if (!values.address) {
      errors.address = 'Ooops! Your hotspot is required';
    } else if (!addressExp.test(values.address)) {
      errors.address = 'Your address is wrong. Check it one more time';
    } else if (values.address === this.props.hsList[this.props.currentHS].data.address) {
      errors.address = 'Ooops! Your hotspot is already added to compare. You can\'t compare it with itself';
    }

    return errors;
  }

  handleSubmit (values) {
    return HeliumAPI.getHotspotChallenges(
      values.address,
      this.handleDataLoadingUpdate,
      this.state.config
    ).then(res => {
      const witnessedBeacon = {};
      const addr = values.address;

      res.map(action => {
        try {
          const witnesses = action.path[0].witnesses;

          if (witnesses && Array.isArray(witnesses) && witnesses.length > 0) {
            witnesses.map(witness => {
              if (witness.gateway === addr) {
                if (!Array.isArray(witnessedBeacon[action.path[0].challengee])) {
                  witnessedBeacon[action.path[0].challengee] = [];

                  witnessedBeacon[action.path[0].challengee].push({
                    lat: action.path[0].challengee_lat,
                    lon: action.path[0].challengee_lon
                  });
                }

                witnessedBeacon[action.path[0].challengee].push(witness);
              }

              return witness;
            });
          }
        } catch (e) {}

        return action;
      });

      return witnessedBeacon;
    }).then(wB => {
      const data = [];

      Object.keys(wB).map(key => {
        const obj = { address: key };
        data.push(obj);

        return key;
      });

      return this.updateState({ data_2: data });
    })
      .then(() => HeliumAPI.getHotspotForAddress(values.address))
      .then(res => {
        const data1 = this.state.data_1.map(item => item.address);
        const data2 = this.state.data_2.map(item => item.address);

        const compareBoth = data1.filter(item => data2.includes(item)).map(item => {
          return { address: item };
        });

        const compareA = data1.filter(function (i) {
          return this.indexOf(i) < 0;
        }, data2).map(item => {
          return { address: item };
        });

        const compareB = data2.filter(function (i) {
          return this.indexOf(i) < 0;
        }, data1).map(item => {
          return { address: item };
        });

        this.updateState({
          comparableHotspot: {
            address: values.address,
            name: res.data.data.name
          },
          compareBoth,
          compareA,
          compareB
        });
      })
      .catch(err => {
        console.error(err);
        captureException(err);
        sendErrorToast('Something went wrong with Helium API. Try one more time');
      });
  }

  generateSecondHotspotData () {
    if (this.state.comparableHotspot === null) {
      return (
        <>
          <h3>Add hotspot to compare</h3>
          <Form onSubmit={values => this.handleSubmit(values)} validate={this.validate} render={({ handleSubmit, form, submitting, pristine, invalid, values }) => (
            <form onSubmit={values => handleSubmit(values)} id='compare-address-form'>
              <div className='config-form-input'>
                <Field type='text' name='address'>
                  {({ input, meta }) => (
                    <React.Fragment>
                      <label htmlFor='compare-address'>Hotspot address</label>
                      <input {...input} className='hs-input' id='compare-address' placeholder='HS Address' />
                      <p className='input-error'>{meta.submitFailed && meta.error}</p>
                    </React.Fragment>
                  )}
                </Field>
              </div>
              <div className='config-form-submit'>
                <FormButton
                  className='btn btn-md btn-decor'
                  type='submit'
                  disabled={submitting}
                >
                  Add to compare
                </FormButton>
              </div>
            </form>
          )}
          />
        </>
      );
    } else {
      return (
        <>
          <h3>{HSName.toView(this.state.comparableHotspot.name)} witnesses - {this.state.data_2.length}</h3>
          <DataTable
            columns={this.columns}
            data={this.state.data_2}
            responsive
            striped
            sortable
            pagination
            paginationPerPage={10}
          />
        </>
      )
    }
  }

  generateDiffs () {
    if (this.state.comparableHotspot === null) {
      return null;
    }

    return (
      <>
        <div className='col-6'>
          <h3>Common witnesses - {this.state.compareBoth.length}</h3>
          <DataTable
            columns={this.columns}
            data={this.state.compareBoth}
            responsive
            striped
            sortable
            pagination
            paginationPerPage={10}
          />
        </div>
        <div className='col-6'>
          <h3>Witnesses only for {HSName.toView(this.props.hsList[this.props.currentHS].data.name)}  - {this.state.compareA.length}</h3>
          <DataTable
            columns={this.columns}
            data={this.state.compareA}
            responsive
            striped
            sortable
            pagination
            paginationPerPage={10}
          />
        </div>
        <div className='col-6'>
          <h3>Witnesses only for {HSName.toView(this.state.comparableHotspot.name)}  - {this.state.compareB.length}</h3>
          <DataTable
            columns={this.columns}
            data={this.state.compareB}
            responsive
            striped
            sortable
            pagination
            paginationPerPage={10}
          />
        </div>
      </>
    );
  }

  render () {
    if (!this.state.loaded) {
      return (
        <section className='rssi route-section'>
          <div className='preload show-preloader'>
            <div className='preload-circle'>
              <div />
              <div />
            </div>
            <div className='preload-progress'>
              <p className='preload-progress-entries'>Loaded {this.state.dataLoadingLength} entries...</p>
              <p className='preload-progress-joke'>#justHeliumAPIThings</p>
            </div>
          </div>
        </section>
      );
    }

    if (this.props.currentHS === null) {
      return <Navigate to='/' />;
    }

    return (
      <section className='compare-hotspots route-section'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <h2>Compare hotspots witnesses</h2>
            </div>
          </div>
          <div className='row'>
            <div className='col-6'>
              <h3>{HSName.toView(this.props.hsList[this.props.currentHS].data.name)} witnesses - {this.state.data_1.length}</h3>
              <DataTable
                columns={this.columns}
                data={this.state.data_1}
                responsive
                striped
                sortable
                pagination
                paginationPerPage={10}
              />
            </div>
            <div className='col-6'>
              {this.generateSecondHotspotData()}
            </div>
            {this.generateDiffs()}
          </div>
        </div>
      </section>
    );
  }
}

export default CompareHotspots;
