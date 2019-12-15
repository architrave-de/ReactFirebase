import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './theme/index.scss'
import * as serviceWorker from './serviceWorker'
import apiCall from './helpers/API'
import 'bootstrap/dist/css/bootstrap.min.css'

const initApp = () => {
  const databaseCollections = apiCall.dbCollection()
  apiCall.getCollectionData(databaseCollections.appManifest).then(data => {
    const name = data[0].name || 'app name'
    ReactDOM.render(<App name={name} />, document.getElementById('root'))
  })
}

initApp()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
