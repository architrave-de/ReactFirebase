import React from 'react'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import { DB } from '../../helpers/firebase'
import { dayToYear } from '../../helpers/timeFunctions'

export default class TableBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      players: [],
      month: null
    }
  }

  componentDidMount() {
    const currentDate = dayToYear({})
    const yearMonth = currentDate.year
      .toString()
      .slice(-2)
      .concat(currentDate.month.toString())
    this.setState({ month: yearMonth })

    const self = this
    DB.collection('players')
      .orderBy(`monthlyRecords.${yearMonth}`, 'desc')
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
    const { players, month } = this.state
    return (
      <>
        <Container>
          <Row>
            <Col md={{ span: 10, offset: 1 }}>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Slack name</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {players &&
                    players.map((player, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{player.name}</td>
                        <td>{player.slackName}</td>
                        <td>{player.monthlyRecords[month]}</td>
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
