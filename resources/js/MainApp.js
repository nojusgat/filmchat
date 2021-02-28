import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Profile from './app/components/Profile';
import Home from './app/components/Home';
import SignUp from './app/components/SignUp';
import Login from './app/components/Login';
import EmailVerify from './app/components/EmailVerify';
import AuthenticationService from './app/services/AuthenticationService';
import ForgotPassword from './app/components/ForgotPassword';

const LoggedInRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    AuthenticationService.getCurrentUser()
      ? <Component {...props} />
      : <Redirect to='/signin' />
  )} />
);

const LoggedOutRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    AuthenticationService.getCurrentUser()
      ? <Redirect to='/home' />
      : <Component {...props} />
  )} />
);

class MainApp extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <LoggedOutRoute path='/' exact={true} component={Login}/>
          <LoggedInRoute path='/home' exact={true} component={Home}/>
          <LoggedInRoute path='/profile' exact={true} component={Profile}/>
          <LoggedOutRoute path='/signin' exact={true} component={Login}/>
          <LoggedOutRoute path='/signup' exact={true} component={SignUp}/>
          <LoggedOutRoute path='/verify-email/:verify_id' exact={true} component={EmailVerify}/>
          <LoggedOutRoute path='/forgotpassword' exact={true} component={ForgotPassword}/>
        </Switch>
      </Router>
    )
  }
}

export default MainApp;