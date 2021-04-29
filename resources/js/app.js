import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainApp from './MainApp';
import 'bootstrap/dist/css/bootstrap.min.css';
import './bootstrap.js';

ReactDOM.render(
  <React.Fragment>
    <MainApp />
  </React.Fragment>,
  document.getElementById('root')
);
