import React from 'react'
import AppNavbar from '../../containers/AppNavbar/AppNavbar'
import Section from '../../containers/Section/Section'
import CardsGroup from '../CardsGroup/CardsGroup'
import TableBoard from '../TableBoard/TableBoard'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Players from '../Players/Players'
import Control from '../ControlPanel'
import MonthlyRecords from '../MonthlyRecords/MonthlyRecords'

export default class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <AppNavbar appName={this.props.name} />
          <Route path="/" exact>
            <Section title="Todays Records" background="black">
              <CardsGroup />
            </Section>
            <Section title="Monthly Records">
              <TableBoard />
            </Section>
          </Route>

          <Route path="/players" exact>
            <Section title="Players table">
              <Players />
            </Section>
          </Route>

          <Route path="/year" exact>
            <Section title="Yearly table">
              <h2>here is the Yearly table</h2>
            </Section>
          </Route>

          <Route path="/month" exact>
            <Section title="Month">
              <MonthlyRecords />
            </Section>
          </Route>

          <Route path="/control-panel" exact>
            <Section title="Admin Control">
              <Control />
            </Section>
          </Route>
        </Router>
      </div>
    )
  }
}
