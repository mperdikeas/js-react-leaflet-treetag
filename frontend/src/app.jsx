const React = require('react');

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";


import MainMapContainer from './main-map-container.jsx';
import About            from './about.jsx';
import Login            from './login.jsx';

// TODO: maybe I should implement different context wrappers for each individual context
import wrapContexts from './context/contexts-wrapper.jsx';

export default function App() {
  return (
    <main>
    <Switch>
      <PrivateRoute path='/main'>
        <MainMapContainer/>
      </PrivateRoute>
      <Route path='/about' component={About}/>
      <Route path='/login' component={Login}/>
      <Route path='/' render={()=><Redirect to={{pathname:'/main'}}/>}/>
    </Switch>
    </main>
  );
}

const PrivateRoute = wrapContexts(function ({ children, ...rest }) {
  console.log('inside private route');
  return (
    <Route
      {...rest}
        render={function ({ location }) {
            console.log(`PrivateRoute, location = ${location}`);
            if (rest.loginContext.username)
              return children;
            else return (
              <Redirect
                       to={{
                       pathname: "/login",
                       state: { from: location }
                       }}
                          />
            );
          }}
    />
            );
}
  );

