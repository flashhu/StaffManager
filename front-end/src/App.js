import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component'
import NavWrapper from './component/navWrapper';

class App extends Component{
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/login' exact component={loadable(() => import('./app/login'))} />>
          <Route path='/register' exact component={loadable(() => import('./app/register'))} />
          <Route path='/' render={() => (
            <NavWrapper>
              <Switch>
                <Route path='/' exact component={loadable(() => import('./app/user'))} />
                <Route path='/post' exact component={loadable(() => import('./app/post'))} />
              </Switch>
            </NavWrapper>
          )}/>
        </Switch>
      </Router>
    )
  }
}

export default App;
