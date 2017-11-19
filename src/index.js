import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reduxThunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import ReactGA from 'react-ga'
import { GOOGLE_GA } from './config'
// allows us to run 100vh in safari:
// import * as viewportUnitsBuggyfill from 'viewport-units-buggyfill'

import reducers from './reducers' // Or wherever you keep your reducers

import './css/index.css'
// // import registerServiceWorker from './registerServiceWorker'

import App from './components/App'

ReactGA.initialize(GOOGLE_GA)
function addAnalytics () {
  ReactGA.set({ page: history.location.pathname + history.location.search })
  ReactGA.pageview(history.location.pathname + history.location.search)
}
// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()
history.listen((location, action) => {
  addAnalytics()
})
// run it on initial load:
addAnalytics()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  applyMiddleware(reduxThunk, middleware)
)

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root')
)

// registerServiceWorker()

// Initialize viewportUnitsBuggyfill
// viewportUnitsBuggyfill.init()
// Also hook viewportUnitsBuggyfill to resize event (if it was initialized)
// if (document.getElementById('patched-viewport')) {
//   window.addEventListener('resize', viewportUnitsBuggyfill.refresh, true)
// }
