import React from 'react'
import HomePage from './containers/HomePage'
import {DB} from './helpers/firebase'


export class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      appManifest: {
        appName: '..loading'
      }
    }
  }

  componentDidMount() {
    DB.collection('manifest').get().then((querySnapshot) => {
      let dbValues = []
      querySnapshot.forEach((doc) => {
        dbValues.push(doc.data())
      })
      this.setState({
        appManifest:{ ...this.state.appManifest,
          appName: dbValues[0].name
        }
      })
    })
  }

  render() {
    return (
      <HomePage name={this.state.appManifest.appName}/>
    )
  }
}

export default App
