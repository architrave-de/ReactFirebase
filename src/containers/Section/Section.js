import React from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import './section.scss'

export default class Section extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <>
        <div className="section-wrapper">
          <Jumbotron className={`section section--${this.props.background}`}>
            <div>
              <h2 className="section__title">{this.props.title}</h2>
            </div>
            {this.props.children}
          </Jumbotron>
        </div>
      </>
    )
  }
}
