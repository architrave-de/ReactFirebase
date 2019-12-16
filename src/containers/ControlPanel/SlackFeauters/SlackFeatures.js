import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import apiCall from '../../../helpers/API'
import {
  slackAction,
  getWorkspaceChannels,
  importUsersFormChannel
} from '../../../helpers/slack'
import Spinner from 'react-bootstrap/Spinner'

export default class SlackFunctions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      channels: [],
      processing: false,
      channelUsers: [],
      channelUsersNumber: null,
      selectedChannel: 'Select channel',
      alert: false
    }
  }

  componentDidMount() {
    const self = this
    console.log('slack features')
    slackAction(getWorkspaceChannels).then(channels => {
      self.setState({ channels })
    })
  }

  handleImportUsers = () => {
    const self = this
    this.setState({
      processing: true
    })
    this.state.channelUsers.forEach((item, i) => {
      item.email = item.email || 'no@email.here'
      self.handleAddPlayer(item)
    })
    this.setState({
      processing: false,
      alert: true
    })
  }

  handleSelectChannel = e => {
    const { name } = e.target
    e.preventDefault()
    const self = this
    self.setState({
      processing: true,
      selectedChannel: name
    })

    slackAction(importUsersFormChannel, { channelName: name }).then(users => {
      self.setState({
        channelUsers: users,
        processing: false
      })
    })
  }

  handleAddPlayer = player => {
    apiCall.addPlayer({ ...player })
  }

  render() {
    return (
      <div className="slack-function">
        <>
          <Alert variant="secondary">
            <Alert.Heading>{this.props.title}</Alert.Heading>
            <hr />
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {this.state.selectedChannel}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {this.state.channels.map((channel, id) => (
                  <Dropdown.Item
                    key={id}
                    name={channel.name}
                    onClick={this.handleSelectChannel}
                  >
                    {channel.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <br />
            <Alert variant="success" show={this.state.alert}>
              {/* {this.state.channelUsers.length} has been imported{' '} */}
            </Alert>
            <div className="d-flex justify-content-end">
              <Button
                disabled={this.state.processing}
                onClick={this.handleImportUsers}
                variant="outline-success"
              >
                {!!this.state.processing ? (
                  <>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{' '}
                    processing ...{' '}
                  </>
                ) : (
                  `Import users`
                )}
              </Button>
            </div>
          </Alert>
        </>
      </div>
    )
  }
}
