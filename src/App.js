import React from 'react'
import HomePage from './containers/HomePage'

export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      appManifest: {
        appName: '..loading'
      }
    }
  }

  render() {
    return <HomePage name={this.props.name} />
  }
}

export default App
