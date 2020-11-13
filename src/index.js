import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import './allocation.scss'
import './_colours.scss'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import allocationApp from './redux/reducers'

// Logger with default options
import { AppContainer } from './Admin/App'

const store = createStore(allocationApp, applyMiddleware(thunkMiddleware, logger))

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
)

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept()
}
