import React from 'react'
import DatePicker from 'react-datepicker'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import { monthName } from '../../helpers/timeFunctions'

export default class MonthlyRecords extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: null,
      dateTitle: ''
    }
  }

  handleDateChange(e) {
    const date = new Date(e)
    const month = date.getMonth()
    const year = date.getFullYear()
    const stateDate = this.setState({
      dateTitle: `${monthName(month)} ${year}`
    })
  }

  render() {
    return (
      <>
        <Container>
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <h6>{this.state.dateTitle}</h6>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">Date</InputGroup.Text>
                  <DatePicker
                    selected={this.state.date}
                    onChange={this.handleDateChange.bind(this)}
                    maxDate={new Date()}
                    dateFormat="MM.yyyy"
                    showMonthYearPicker
                  />
                </InputGroup.Prepend>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}
