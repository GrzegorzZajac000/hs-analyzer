import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import '@popperjs/core';
import 'bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import 'react-calendar/dist/Calendar.css';

import './index.scss';
import App from './components/App';

import * as Sentry from '@sentry/react';

import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineController, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { chartWatermark } from './utilities';
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineController, LineElement, BarElement, Title, Tooltip, Legend, chartWatermark);

let appElement = null;

if (typeof document !== 'undefined') {
  appElement = document.getElementById('app');
}

Sentry.init({ dsn: process.env.SENTRY_DSN });

ReactDOM.render(
  <App />,
  appElement
);
