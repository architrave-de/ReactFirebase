import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './theme/index.scss'
import * as serviceWorker from './serviceWorker'
import APIcall from './helpers/API'

const initApp = () => {
        const databaseCollections = APIcall.dbCollectinos()
        APIcall.getAppManifest(databaseCollections.appManifest).then(data => data[0])
        .then(data => ReactDOM.render(<App name={data.name}/>, document.getElementById('root')))
}

initApp()



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
