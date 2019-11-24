import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import apiCall from '../../helpers/API'
import './navbar.scss'

export default class NavBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      appSections: []
    }
  }

  componentDidMount() {
    const self = this
    const databaseCollections = apiCall.dbCollection()
    apiCall.getCollectionData(databaseCollections.sections).then(data => {
      let sections = []
      data.forEach(item => sections.push(item))
      self.setState({ appSections: sections })
      return sections
    })
  }

  render() {
    const sections = this.state.appSections

    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home">{this.props.appName}</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {sections.map(item => (
              <Nav.Link href={item.url} key={item.name}>
                {item.name}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
