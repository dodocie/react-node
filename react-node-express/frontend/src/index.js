import React            from 'react';
import ReactDOM         from 'react-dom'
import FastClick        from 'fastclick'
import {Provider}       from 'react-redux'

import Route     from './router'
import store     from './redux/store'
import './style/adapt'
import './style/index.css'

FastClick.attach(document.body)

ReactDOM.render(
  (
      <Provider store={store}>
        <Route/>
      </Provider>
  ),
  document.getElementById('root')
);


