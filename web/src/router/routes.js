import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

//import { PrivateRoute } from './PrivateRoute';

import Login from '../components/Login';
import Register from '../components/Register';
import Forgot from '../components/Forgot';
import Reset from '../components/Reset';
//import UserList from '../components/UserList';
//import Home from '../components/Home';
//import LoadingScreen from '../components/LoadingScreen';


export default class routes extends Component {
  render() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact={true} component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/forgot" component={Forgot} />
                <Route path="/reset" component={Reset} />
            </Switch>
        </BrowserRouter>
    );
  }
}

/*
<PrivateRoute path="/Home" component={Home2} />
<Route path="/Register" component={Register2} />
<Route path="/Forgot" component={Forgot2} />
<Route path="/Reset" component={Reset2} />
<Route path="/UserList" component={UserList} />
<Route path="/." component={LoadingScreen} />
*/