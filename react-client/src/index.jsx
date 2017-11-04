import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import App from './components/App.jsx';
import store, { history } from './store';

render(
      <App />,
  document.getElementById('root'));