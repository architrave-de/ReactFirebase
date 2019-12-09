import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import apiCall from '../../helpers/API'
import './navbar.scss'
import { Link } from 'react-router-dom'

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
      <div className="app-navbar">
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">{this.props.appName}</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              {sections.map(item => (
                <Nav.Link href={item.url} key={item.name}>
                  <Link
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    to={item.url}
                  >
                    {' '}
                    {item.name}
                  </Link>
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}
