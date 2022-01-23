import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { Menu, TopBar, Home } from './index';
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
          <div className='app-content'>
            <Menu />
            <div className='app-content-view'>
              <TopBar />

              <BrowserRouter>
                <Routes>
                  <Route path='/' element={<Home />} />
                </Routes>
              </BrowserRouter>
            </div>
          </div>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
