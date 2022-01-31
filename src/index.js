import React from 'react';
import ReactDOM from 'react-dom';
import '@popperjs/core';
import 'bootstrap';
import 'react-toastify/dist/ReactToastify.css';

import './index.scss';
import App from './components/App';

let appElement = null;

if (typeof document !== 'undefined') {
  appElement = document.getElementById('app');
}

ReactDOM.render(
  <App />,
  appElement
);
