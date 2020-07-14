import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './pages/login';
import Register from './pages/user/register';
import ForgotPassword from './pages/user/forgotPassword';
import ResetPassword from './pages/user/resetPassword';
import Home from './pages/home';
import UserInfo from './pages/user/userInfo';
import Exercise from './pages/exercise';

const AppStack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
        <AppStack.Navigator headerMode="none">
            <AppStack.Screen name="Login" component={Login} />
            <AppStack.Screen name="Register" component={Register} />
            <AppStack.Screen name="ForgotPassword" component={ForgotPassword} />
            <AppStack.Screen name="ResetPassword" component={ResetPassword} />
            <AppStack.Screen name="Home" component={Home} />
            <AppStack.Screen name="UserInfo" component={UserInfo} />
            <AppStack.Screen name="Exercise" component={Exercise} />
        </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;