import React from 'react';
import Routes from './routes';
import './config/StatusBarConfig';

//Disable warnings from front end
console.disableYellowBox = true;

//Open app based in Routes screen order
const App = () => <Routes />;

export default App;