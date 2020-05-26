const React = require('react');


import MainMapContainer from './main-map-container.jsx';
import About            from './about.jsx';

import { Switch, Route } from 'react-router-dom'

export default function App() {
  return (
    <main>
    <Switch>
      <Route exact path='/' component={MainMapContainer}/>
      <Route path='/about' component={About}/>
    </Switch>
    </main>
  );
}
