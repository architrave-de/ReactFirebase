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

export default class CardsGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const cardImages = [second, first, third]
    return (
      <>
        <Container className="cards-group">
          <Row>
            <Col md={{ span: 10, offset: 1 }}>
              <CardDeck>
                {this.props.cards.map((card, index) => (
                  <Card className={`card-${card.position}`} key={index}>
                    <div className="cards-group__image-wrapper">
                      <Card.Img variant="top" src={cardImages[index]} />
                    </div>
                    <Card.Body>
                      {card.rounds.map((round, i) => (
                        <div key={i}>
                          <Card.Title>{round.name}</Card.Title>
                          <ul>
                            <li>{round.winner}</li>
                          </ul>
                        </div>
                      ))}
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">
                        Last updated 3 mins ago
                      </small>
                    </Card.Footer>
                  </Card>
                ))}
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
    {
      position: 2,
      rounds: [
        {
          name: 'Round one',
          winner: 'Ali'
        },
        {
          name: 'Round Two',
          winner: 'Chris'
        }
      ]
    },
    {
      position: 1,
      rounds: [
        {
          name: 'Round one',
          winner: 'Anne'
        },
        {
          name: 'Round Two',
          winner: 'Lilly'
        }
      ]
    },
    {
      position: 3,
      rounds: [
        {
          name: 'Round one',
          winner: 'Mike'
        },
        {
          name: 'Round Two',
          winner: 'John'
        }
      ]
    }
  ]
}
