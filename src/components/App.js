import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { Menu, TopBar, HSModal } from './index';
import { Activity, ChainVariables, City, CompareHotspots, Connectivity, Donate, Info, NoMatch, Rssi, Snr } from '../routes';
import { Provider } from 'react-redux';
import createStore from '../store/createStore';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import { BaseComponent } from '../utilities';

class App extends BaseComponent {
  constructor (props) {
    super(props);

    this.store = createStore();
    this.persistor = null;

    this.persistor = persistStore(this.store, null);

    this.state = {
      topBar: 0
    };

    this.updateTopBar = this.updateTopBar.bind(this);
  }

  updateTopBar () {
    this.updateState({ topBar: this.state.topBar + 1 });
  }

  render () {
    return (
      <Provider store={this.store}>
        <PersistGate loading={null} persistor={this.persistor}>
          <BrowserRouter>
            <div className='app-content'>
              <div className='container-fluid'>
                <div className='row'>
                  <div className='col-3 col-xl-2 gx-0 menu-container'>
                    <Menu />
                  </div>
                  <div className='col-9 col-xl-10 gx-0 body-container'>
                    <TopBar id={this.state.topBar} />
                    <HSModal />

                    <Routes>
                      <Route path='/' element={<Info />} />
                      <Route path='/chain-variables' element={<ChainVariables />} />
                      <Route path='/city' element={<City updateTopBar={this.updateTopBar} />} />
                      <Route path='/connectivity' element={<Connectivity />} />
                      <Route path='/activity' element={<Activity />} />
                      <Route path='/rssi' element={<Rssi />} />
                      <Route path='/snr' element={<Snr />} />
                      <Route path='/donate' element={<Donate />} />
                      <Route path='/compare-hotspots' element={<CompareHotspots />} />

                      <Route path='*' element={<NoMatch />} />
                    </Routes>
                  </div>
                </div>
              </div>

              <ToastContainer
                position='bottom-right'
                autoClose={false}
                newestOnTop
                closeOnClick
                hideProgressBar
              />
            </div>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
