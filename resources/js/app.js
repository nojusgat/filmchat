import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainApp from './MainApp';
import 'bootstrap/dist/css/bootstrap.min.css';
import './bootstrap.js';

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

ReactDOM.render(
  <React.Fragment>
    <ReactNotification/>
    <MainApp />
  </React.Fragment>,
  document.getElementById('root')
);
