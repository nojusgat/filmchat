import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Profile from './app/components/Profile';
import Home from './app/components/Home';
import UserPage from './app/components/UserPage';
import SignUp from './app/components/SignUp';
import Login from './app/components/Login';

class MainApp extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Login}/>
          <Route path='/home' exact={true} component={Home}/>
          <Route path='/profile' exact={true} component={Profile}/>
          <Route path='/user' exact={true} component={UserPage}/>
          <Route path='/signin' exact={true} component={Login}/>
          <Route path='/signup' exact={true} component={SignUp}/>  
        </Switch>
      </Router>
    )
  }
}

export default MainApp;