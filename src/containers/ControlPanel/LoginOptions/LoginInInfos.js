import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import React from 'react'

export default function LoginInfos({ mainButtonAction, title = 'Welcome!' }) {
  return (
    <Alert variant="secondary">
      <Alert.Heading>{title}</Alert.Heading>
      <hr />
      you are logged in, you can sign out here.
      <div className="d-flex justify-content-end">
        <Button onClick={() => mainButtonAction({})} variant="outline-success">
          Log me out
        </Button>
      </div>
    </Alert>
  )
}
