import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { Menu, TopBar, HSModal } from './index';
import { Activity, ChainVariables, Connectivity, Donate, Info, NoMatch, Rssi, Snr } from '../routes';
import { Provider } from 'react-redux';
import createStore from '../store/createStore';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';

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
                    <HSModal />

                    <Routes>
                      <Route path='/' element={<Info />} />
                      <Route path='/chain-variables' element={<ChainVariables />} />
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
                autoClose={5000}
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

export default App;
