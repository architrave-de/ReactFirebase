import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'
import first from '../../assets/svgs/one.svg'
import second from '../../assets/svgs/second.svg'
import third from '../../assets/svgs/third.svg'
import PropTypes from 'prop-types'
import './cards-group.scss'
import { DB } from '../../helpers/firebase'
import { dayToYear, dayWithYearNumber } from '../../helpers/timeFunctions'

export default class CardsGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dayMatches: []
    }
  }

  componentDidMount() {
    const todayNumber = dayWithYearNumber({ day: dayToYear({}) })
    const self = this
    DB.collection('days')
      .where('dayNumber', '==', todayNumber)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function(doc) {
          self.setState({
            dayMatches: [...self.state.dayMatches, doc.data()]
          })
        })
      })
      .catch(error => {
        console.log('Error getting the results: ', error)
      })
  }

  card = (card, index, cardImages) => {
    const { rounds } = card
    return (
      <Card className={`card-${card.position}`} key={index}>
        <div className="cards-group__image-wrapper">
          <Card.Img variant="top" src={cardImages[index]} />
        </div>
        <Card.Body>
          {rounds.length >= 1 ? (
            rounds.map((round, i) => (
              <div key={i}>
                <Card.Title>{round.description}</Card.Title>
                <ul>
                  <li>{round.players && round.players[card.position].name}</li>
                </ul>
              </div>
            ))
          ) : (
            <>
              <Card.Title>there is no data</Card.Title>
            </>
          )}
        </Card.Body>
        <Card.Footer></Card.Footer>
      </Card>
    )
  }

  render() {
    const cards = this.props.cards
    if (this.state.dayMatches[0]) {
      cards.map(card => {
        card.rounds = this.state.dayMatches[0].rounds || []
      })
    }

    const cardImages = [second, first, third]
    return (
      <>
        <Container className="cards-group">
          <Row>
            }
            <Col md={{ span: 10, offset: 1 }}>
              <CardDeck>
                {!!cards &&
                  cards.forEach(card => {
                    if (card.rounds.length < 1) {
                    }
                  })}
                {cards.map((card, index) => this.card(card, index, cardImages))}
              </CardDeck>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

CardsGroup.propTypes = {
  cards: PropTypes.array
}

CardsGroup.defaultProps = {
  cards: [
    { position: 2, rounds: [] },
    { position: 1, rounds: [] },
    { position: 3, rounds: [] }
  ]
}
