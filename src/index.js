import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './theme/index.scss'
import * as serviceWorker from './serviceWorker'

const initApp = () => {
        return <App />
}

ReactDOM.render(initApp(), document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
