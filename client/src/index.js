import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import reducers from './redux/reducer'

import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css'
import './index.css';

const store = configureStore({
  reducer : reducers,
  middleware : [ReduxThunk],
  devTools : true
});

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// note
// npm install semantic-ui-css --save
// npm install semantic-ui-react