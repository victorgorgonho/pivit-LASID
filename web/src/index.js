import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router/routes';
import { Provider } from 'react-redux';
import store from './store';
import './global.css';

import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <Provider store={store} >
    <SnackbarProvider maxSnack={3}>
      <Router /> 
    </SnackbarProvider>
  </Provider>
  , document.getElementById('root'));
