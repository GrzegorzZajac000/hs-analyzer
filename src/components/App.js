import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { Menu, TopBar } from './index';
import { Activity, Connectivity, Donate, Home, Info, NoMatch, Rssi, Snr } from '../routes';
import { Provider } from 'react-redux';
import createStore from '../store/createStore';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

class App extends React.Component {
  constructor (props) {
    super(props);

    this.store = createStore();
    this.persistor = null;

    this.persistor = persistStore(this.store, null);
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
                    <TopBar />

                    <Routes>
                      <Route path='/' element={<Home />} />
                      <Route path='/info' element={<Info />} />
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
            </div>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
