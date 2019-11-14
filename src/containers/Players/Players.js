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
      playersList: []
    }
  }

  componentDidMount() {
    const self = this
    const databaseCollections = apiCall.dbCollection()
    apiCall
      .getCollectionData(databaseCollections.players, 'total-points', 'desc')
      .then(data => {
        let players = []
        data.forEach(item => players.push(item))
        self.setState({ playersList: players })
        return players
      })
  }
  render() {
    const { playersList } = this.state
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
                    <th>Total points</th>
                    <th>Slack name</th>
                  </tr>
                </thead>
                <tbody>
                  {playersList.map((player, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{player.name}</td>
                      <td>{player['total-points']}</td>
                      <td>{player['slack-name']}</td>
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
