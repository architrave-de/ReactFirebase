import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import React from 'react'

export default function LoginInfos({
  mainButtonAction,
  title = 'Welcome!',
  user = { name: 'user name' }
}) {
  return (
    <Alert variant="secondary">
      <Alert.Heading>
        {title} {user.name}
      </Alert.Heading>
      <hr />
      <Image src={user.image} rounded style={{ width: '96px' }} />
      <br />
      you are logged in, you can sign out here.
      <div className="d-flex justify-content-end">
        <Button onClick={() => mainButtonAction({})} variant="outline-info">
          Log me out
        </Button>
      </div>
    </Alert>
  )
}
