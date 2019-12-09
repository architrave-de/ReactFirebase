import React from 'react'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import apiCall from '../../helpers/API'

export default class Players extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      players: []
    }
  }

  componentDidMount() {
    const self = this
    apiCall.players
      .orderBy('name', 'asc')
      .get()
      .then(querySnapshot => {
        let players = []
        querySnapshot.forEach(function(doc) {
          players.push(doc.data())
        })
        self.setState({
          players: players
        })
      })
      .catch(error => {
        console.log('Error getting the results: ', error)
      })
  }

  render() {
    const { players } = this.state
    return (
      <>
        <Container>
          <Row>
            <Col md={{ span: 10, offset: 1 }}>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>email</th>
                    <th>Slack name</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, i) => (
                    <tr key={i}>
                      <td>{player.id}</td>
                      <td>{player.name}</td>
                      <td>{player.email}</td>
                      <td>{player.slackName}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}
