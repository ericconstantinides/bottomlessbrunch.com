import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { BrowserRouter } from 'react-router-dom'
import { composeWithDevTools } from 'redux-devtools-extension'
import './index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import reducers from './reducers'

// new
const createStoreWithMiddleware = createStore(reducers, composeWithDevTools(
  applyMiddleware()
))

ReactDOM.render(
  <Provider store={createStoreWithMiddleware}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  , document.getElementById('root')
)
registerServiceWorker()
