import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Profile from './app/components/Profile';
import Home from './app/components/Home';
import SignUp from './app/components/SignUp';
import Login from './app/components/Login';
import EmailVerify from './app/components/EmailVerify';
import AuthenticationService from './app/services/AuthenticationService';
import ForgotPassword from './app/components/ForgotPassword';
import ForgotPasswordComplete from './app/components/ForgotPasswordComplete';
import About from './app/components/About';
import MovieDetails from './app/components/MovieDetails';
import Users from './app/components/Users';
import UserProfile from './app/components/UserProfile';
import FriendRequests from './app/components/FriendRequests';
import Friends from './app/components/Friends';
import Chat from './app/components/Chat';

const LoggedInRoute = ({ component: Component, ...rest }) => {
    const user = AuthenticationService.getCurrentUser();
    const token = user ? user.access_token : null;
    window.Echo.connector.pusher.config.auth.headers['Authorization'] = 'bearer ' + token;
    return (
        <Route {...rest} render={(props) => (
            user ? <Component {...props} /> : <Redirect to='/signin' />
        )} />
    );
};

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
                    <LoggedOutRoute path='/' exact={true} component={Login} />
                    <LoggedInRoute path='/home' exact={true} component={Home} />
                    <LoggedInRoute path='/profile' exact={true} component={Profile} />
                    <LoggedOutRoute path='/signin' exact={true} component={Login} />
                    <LoggedOutRoute path='/signup' exact={true} component={SignUp} />
                    <LoggedOutRoute path='/email/verify/:verify_id' exact={true} component={EmailVerify} />
                    <LoggedOutRoute path='/email/reset/:reset_id' exact={true} component={ForgotPasswordComplete} />
                    <LoggedOutRoute path='/forgotpassword' exact={true} component={ForgotPassword} />
                    <LoggedInRoute path='/about' exact={true} component={About} />
                    <LoggedInRoute path='/movie/:id' exact={true} component={MovieDetails} />
                    <LoggedInRoute path='/users' exact={true} component={Users} />
                    <LoggedInRoute path='/user/:id' exact={true} component={UserProfile} />
                    <LoggedInRoute path='/requests' exact={true} component={FriendRequests} />
                    <LoggedInRoute path='/friends' exact={true} component={Friends} />
                    <LoggedInRoute path='/chat' exact={true} component={Chat} />
                    <LoggedInRoute path='/chat/:id' exact={true} component={Chat} />
                </Switch>
            </Router>
        )
    }
}

export default MainApp;
