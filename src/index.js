import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.scss';
import App from './components/App';

let appElement = null;

if (typeof document !== 'undefined') {
  appElement = document.getElementById('app');
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  appElement
);
