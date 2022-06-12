/**
 * App.js Layout Start Here
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import CircularProgress from '@material-ui/core/CircularProgress';



// rct theme provider
import RctThemeProvider from './RctThemeProvider';
import Loader from '../util/loader';

//Horizontal Layout
//import HorizontalLayout from './HorizontalLayout';

//Agency Layout
//import AgencyLayout from './AgencyLayout';

//Main App

import RctDefaultLayout from './DefaultLayout';

// boxed layout
//import RctBoxedLayout from './RctBoxedLayout';

// CRM layout
// import CRMLayout from './CRMLayout';

// app signin
import AppSignIn from './Signin';
import ResetPassword from './ForgotPassword'
// import AppSignUp from './SignupFirebase';

// async components
// import {
//    AsyncSessionLoginComponent,
//    AsyncSessionRegisterComponent,
//    AsyncSessionLockScreenComponent,
//    AsyncSessionForgotPasswordComponent,
//    AsyncSessionPage404Component,
//    AsyncSessionPage500Component,
//    AsyncTermsConditionComponent
// } from 'Components/AsyncComponent/AsyncComponent';

//Auth0
import Auth from '../Auth/Auth';

// callback component
import Callback from "Components/Callback/Callback";

//Auth0 Handle Authentication
const auth = new Auth();

const handleAuthentication = ({ location }) => {
   if (/access_token|id_token|error/.test(location.hash)) {
      auth.handleAuthentication();
   }
}

/**
 * Initial Path To Check Whether User Is Logged In Or Not
 */
const InitialPath = ({ component: Component, authUser, ...rest }) =>
   <Route
      {...rest}
      render={props =>
         localStorage.getItem('DUDU_AUTH_TOKEN') !== null
            ? <Component {...props} />
            : <Redirect
               to={{
                  pathname: '/signin',
                  state: { from: props.location }
               }}
            />}
   />;

class App extends Component {
   render() {
      var DEBUG = true;
      if (!DEBUG) {
         var methods = ["log", "debug", "warn", "info"];
         for (var i = 0; i < methods.length; i++) {
            console[methods[i]] = function () { };
         }
      }
      //console.log('\n\n PRO->', this.props.loading);
      const { location, match, user, loading } = this.props;
    

      if (location.pathname === '/') {
         if (localStorage.getItem('DUDU_AUTH_TOKEN') === null) {
            return (<Redirect to={'/signin'} />);
         } else {
            return (<Redirect to={'/admin-panel/users'} />);
         }
      }
      return (
         <RctThemeProvider>
            {
               loading &&
               <div className="loader">
                  <CircularProgress className="w-5 progress-primary" thickness={3} />
               </div>
            }
            <NotificationContainer />
            {localStorage.getItem('DUDU_AUTH_TOKEN') !== null ?
               <Switch>
                  <InitialPath
                     path={`${match.url}admin-panel`}
                     authUser={user}
                     component={RctDefaultLayout}
                  />
                  {/* <Route path="/dashboard" exact={true} component={RctDefaultLayout} /> */}
                  <Redirect to="/admin-panel/users" />
               </Switch> :
               <Switch>
                  <Route path="/signin" exact={true} component={AppSignIn} />
                  <Route path="/resetPassword" exact={true} component={ResetPassword} />
                  <Redirect to="/signin" />
               </Switch>
            }
            {/* <InitialPath
               path={`${match.url}admin-panel`}
               authUser={user}
               component={RctDefaultLayout}
            />
           
            <Route path="/signin" exact={true} component={AppSignIn} />
            <Route path="/resetPassword" exact={true} component={ResetPassword} /> */}

            {/* <Route path="/callback" render={(props) => {
               handleAuthentication(props);
               return <Callback {...props} />
            }} /> */}
         </RctThemeProvider>
      );
   }
}

// map state to props
const mapStateToProps = ({ authUser }) => {
   const { user, loading } = authUser;
   return {
      user,
      loading
   };
};

export default connect(mapStateToProps)(App);
