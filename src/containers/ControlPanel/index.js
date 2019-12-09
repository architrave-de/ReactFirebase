import React from 'react'
import PropTypes from 'prop-types'
import Players from '../Players/Players'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import apiCall from '../../helpers/API'
import AddRound from './AddRound/AddRound'

export default class ControlPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lastPlayerId: null,
      playerFields: {
        name: {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'enter player name'
        },
        email: {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'enter player email'
        },
        password: {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'password'
        },
        slackName: {
          name: 'slackName',
          label: 'Slack name',
          type: 'text',
          placeholder: 'enter player slack name'
        },
        image: {
          name: 'image',
          label: 'Image',
          type: 'text',
          placeholder: 'enter image path'
        }
      }
    }
  }

  componentDidMount() {
    apiCall
      .lastPlayerId()
      .then(id =>
        this.setState({
          lastPlayerId: parseInt(id) + 1
        })
      )
      .catch(e => {
        console.log('the player id cant be generated')
      })
  }

  handleAddPlayer = e => {
    e.preventDefault()
    const playerInfo = {}
    const form = new FormData(e.target)
    for (let item in this.state.playerFields) {
      playerInfo[item] = form.get(item)
    }
    apiCall
      .addPlayer({ ...playerInfo, id: this.state.lastPlayerId.toString() })
      .then(data => {})
  }

  updatePlayerPoints = () => {
    console.log('update player points')
  }

  updatePlayersPoints() {
    console.log('update the players points')
  }

  render() {
    const { playerFields } = this.state
    const addPlayerForm = () => {
      return (
        <Form onSubmit={this.handleAddPlayer}>
          {!!playerFields &&
            Object.keys(playerFields).map(field => (
              <Form.Group key={playerFields[field].name}>
                <Form.Label>{playerFields[field].label}</Form.Label>
                <Form.Control {...playerFields[field]} />
              </Form.Group>
            ))}
          <Button variant="primary" type="submit">
            Add new player
          </Button>
        </Form>
      )
    }

    return (
      <>
        <Container>
          <Row>
            <Col md={{ span: 10, offset: 1 }}>
              <AddRound />
              <Accordion defaultActiveKey="0">
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="1">
                    Add Player
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>{addPlayerForm()}</Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

ControlPanel.propTypes = {
  Auth: PropTypes.array
}
