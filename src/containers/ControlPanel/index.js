import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import apiCall from '../../helpers/API'
import AddRound from './AddRound/AddRound'
import * as firebaseui from 'firebaseui'
import firebase from 'firebase/app'
import 'firebaseui/dist/firebaseui.css'
import Spinner from 'react-bootstrap/Spinner'
import { firebaseUiConfig } from '../../helpers/firebase'
import SlackFeatures from './SlackFeauters/SlackFeatures'
import LoginInfos from './LoginOptions/LoginInInfos'

export default class ControlPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errMessage: null,
      loading: true,
      isUserLoggedIn: true,
      lastPlayerId: null,
      currentUser: '',
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
    this.showLoginOptions({})
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

  showLoginOptions = () => {
    const self = this
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('TCL: ControlPanel -> showLoginOptions -> user', user)
        apiCall.playerByEmail({ email: user.email }).then(user => {
          self.setState({
            loading: false,
            isUserLogged: true,
            currentUser: user
          })
        })
        const { email } = user
        const emailDomain = email.substring(email.lastIndexOf('@') + 1)
        if (emailDomain !== 'architrave') {
        }
      } else {
        self.setState({
          loading: false,
          isUserLogged: false
        })
      }
    })
    // Initialize the FirebaseUI Widget using Firebase.
    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth())

    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', firebaseUiConfig({}))
  }

  handleSignOut = ({ errMessage }) => {
    const self = this
    firebase
      .auth()
      .signOut()
      .then(data => {
        self.setState({
          loading: true,
          isUserLogged: false,
          errMessage: errMessage || null,
          currentUser: null
        })
        self.showLoginOptions({ uiExists: true })
      })
  }

  handleAddPlayer = e => {
    e.preventDefault()
    const playerInfo = {}
    const form = new FormData(e.target)
    for (let item in this.state.playerFields) {
      playerInfo[item] = form.get(item)
    }
    apiCall.addPlayer({ ...playerInfo }).then(data => {})
  }

  render() {
    const { playerFields, isUserLogged, loading, currentUser } = this.state
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

    const content = () => (
      <Container>
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            {isUserLogged ? (
              <>
                <LoginInfos
                  mainButtonAction={this.handleSignOut}
                  user={currentUser}
                />
                <AddRound title="Add new round" user={currentUser} />
                <br />
                <SlackFeatures title="Import Slack channel's users" />
                <br />
                <Accordion defaultActiveKey="0">
                  <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                      Add player manually
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                      <Card.Body>{addPlayerForm()}</Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </>
            ) : (
              <Card className="text-left">
                {!!loading && (
                  <Button variant="primary" disabled>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading...
                  </Button>
                )}
                <Card.Header></Card.Header>
                <Card.Body>
                  <Card.Title>Please Login to continue ..</Card.Title>
                  <Card.Text>
                    <div id="firebaseui-auth-container"></div>
                  </Card.Text>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    )

    return <>{content()}</>
  }
}

ControlPanel.propTypes = {
  Auth: PropTypes.array
}
