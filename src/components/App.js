import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { Menu, TopBar } from './index';
import { Activity, Config, Connectivity, Donate, Info, NoMatch, Rssi, Snr } from '../routes';
import { Provider } from 'react-redux';
import createStore from '../store/createStore';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';
import HeliumAPI from '../api/HeliumAPI';

class App extends React.Component {
  constructor (props) {
    super(props);

    this.store = createStore();
    this.persistor = null;

    this.persistor = persistStore(this.store, null);
  }

  componentDidMount () {
    return Promise.all([
      HeliumAPI.getBlockchainStats(),
      HeliumAPI.getBlockchainHeight(),
      HeliumAPI.getRichestAccounts(),
      HeliumAPI.getRewardsTotal(),
      HeliumAPI.getDCBurnsTotal()
    ]).then(res => {
      console.log(res);
    }).catch(err => {
      console.error(err);

      toast.error('Something went wrong with Helium API. Try one more time', {
        theme: 'dark'
      });
    });
  }

  render () {
    return (
      <Provider store={this.store}>
        <PersistGate loading={null} persistor={this.persistor}>
          <BrowserRouter>
            <div className='app-content'>
              <div className='container-fluid'>
                <div className='row'>
                  <div className='col-2 gx-0'>
                    <Menu />
                  </div>
                  <div className='col-10 gx-0'>
                    <TopBar hsInfo={this.props.hsInfo} />

                    <Routes>
                      <Route path='/' element={<Info />} />
                      <Route path='/config' element={<Config />} />
                      <Route path='/connectivity' element={<Connectivity />} />
                      <Route path='/activity' element={<Activity />} />
                      <Route path='/rssi' element={<Rssi />} />
                      <Route path='/snr' element={<Snr />} />
                      <Route path='/donate' element={<Donate />} />

                      <Route path='*' element={<NoMatch />} />
                    </Routes>
                  </div>
                </div>
              </div>

              <ToastContainer
                position='top-right'
                autoClose={500000}
                newestOnTop
                closeOnClick
              />
            </div>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    );
  }
}

App.propTypes = {
  hsInfo: PropTypes.object
};

export default App;
