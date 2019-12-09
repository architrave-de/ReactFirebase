import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Jumbotron from 'react-bootstrap/Jumbotron'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import apiCall from '../../../helpers/API'
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import DatePicker from 'react-datepicker'
import { dayToYear } from '../../../helpers/timeFunctions'
import 'react-datepicker/dist/react-datepicker.css'

export default class AddRound extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      playersList: [],
      round: {
        players: {},
        date: null,
        insertDate: new Date(),
        description: ''
      }
    }
  }

  componentDidMount() {
    apiCall.playersList.then(list => {
      this.setState({
        playersList: list
      })
    })
  }

  handleInput = e => {
    e.persist()
    const { name, value } = e.target
    const round = this.state.round
    round[name] = value
    this.setState({ round: round })
  }

  handleDateChange = date => {
    const newRound = this.state.round
    newRound.date = date
    newRound.players = {}
    this.setState({ round: newRound, dayInfos: dayToYear({ startDate: date }) })
  }

  handleAddRound = e => {
    e.preventDefault()
    const { round, dayInfos } = this.state
    if (Object.keys(round.players).length < 3) {
      this.setState({ error: 'please choose 3 players!' })
      return false
    }
    // ToDo: add the insertedBy data after having login feature
    round.insertedBy = {}
    apiCall
      .addRound({ dayNumber: dayInfos.yearDayNumber, round: round })
      .then(data => {
        const { players } = round
        for (let player of Object.keys(players)) {
          this.updatePlayerPoints(players[player])
        }
        this.setState({
          error: null,
          playersList: [],
          round: {
            players: {},
            date: null,
            insertDate: new Date(),
            description: ''
          }
        })
      })
      .catch(error => console.log('there is an error', error))
  }

  updatePlayerPoints(player) {
    apiCall.updatePlayer(player)
  }

  selectedMonthId(date) {
    const n = dayToYear({ startDate: date })
    const { year, month } = n
    const yearMonth = year
      .toString()
      .slice(-2)
      .concat(month.toString())
    return yearMonth
  }

  handleSelectPlayer = e => {
    const stateRound = this.state.round
    const scores = [0, 3, 2, 1]
    const { name, id } = e.target
    const position = name
    // get the selected player and update it
    const player = this.state.playersList.filter(player => player.id === id)[0]

    const actualMonthlyPoints =
      player.monthlyRecords[this.selectedMonthId(stateRound.date)] || 0
    player.monthlyRecords[this.selectedMonthId(stateRound.date)] =
      actualMonthlyPoints + scores[position]
    player.totalPoints = player.totalPoints + scores[position]
    //set the final player
    stateRound.players[position] = player
    this.setState({
      round: { ...stateRound },
      error: null
    })
  }

  render() {
    const { players } = this.state.round || {}
    const positions = [
      { style: 'Success', id: 1, title: 'First Player' },
      { style: 'Primary', id: 2, title: 'Second Player' },
      { style: 'Secondary', id: 3, title: 'third Player' }
    ]
    return (
      <Card
        style={{ backgroundColor: 'white', margin: '14px 0', padding: '7px' }}
      >
        <Jumbotron>
          <h2>Add Round</h2>
          <hr></hr>
          <Form.Group controlId="roundDescription">
            <Form.Label>Give it a name</Form.Label>
            <Form.Control
              type="text"
              as="input"
              name="description"
              onChange={this.handleInput}
              value={this.state.round.description}
              placeholder="like lunch round.."
            />
          </Form.Group>

          <Form onSubmit={this.handleAddRound}>
            <Form.Group controlId="roundDate">
              <Form.Label>Select round's date</Form.Label>
              <br></br>
              <Form.Text className="text-muted">it's mandatory!</Form.Text>
              <DatePicker
                selected={this.state.round.date}
                onChange={this.handleDateChange}
                maxDate={new Date()}
              />
            </Form.Group>
            <hr></hr>
            {!!this.state.round.date && (
              <Form.Row>
                <ButtonToolbar>
                  <Row>
                    {positions.map((variant, i) => (
                      <Col>
                        <h6>
                          {players[variant.id] ? players[variant.id].name : '-'}
                        </h6>
                        <DropdownButton
                          title={variant.title}
                          variant={variant.style.toLowerCase()}
                          id={`dropdown-variants-${variant.style}`}
                          key={variant.id}
                        >
                          {!!this.state.playersList &&
                            this.state.playersList.map((player, i) => (
                              <Dropdown.Item
                                key={i}
                                // position < first/second/third>
                                name={variant.id}
                                id={player.id}
                                onClick={this.handleSelectPlayer}
                              >
                                {player.name}
                              </Dropdown.Item>
                            ))}
                        </DropdownButton>
                      </Col>
                    ))}
                  </Row>
                </ButtonToolbar>
              </Form.Row>
            )}
            <br />
            {!!this.state.error && (
              <>
                <Alert key={4} variant="warning">
                  {this.state.error}
                </Alert>
                <br />
              </>
            )}
            <Button variant="primary" type="submit">
              Add Round
            </Button>
            <Form.Row></Form.Row>
          </Form>
        </Jumbotron>
      </Card>
    )
  }
}
