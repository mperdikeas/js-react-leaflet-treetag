const React = require('react');

import {
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from 'react-router-dom';


import MainMapContainer from './main-map-container.jsx';
import About            from './about.jsx';
import LoginPage        from './components/login/login-page.jsx';

// TODO: maybe I should implement different context wrappers for each individual context
import wrapContexts from './context/contexts-wrapper.jsx';

export default function App() {
  const protectedMap = (
    <PrivateRoute path='/main'> 
      <MainMapContainer/>
    </PrivateRoute> 
  );
  const publicMap = (
    <Route path='/main'> 
      <MainMapContainer/>
    </Route> 
  );  
  return (
    <Switch>
      {protectedMap}
      <Route path='/main' component={MainMapContainer}/>
      <Route path='/about' component={About}/>
      {/* it is very likely that the below method is fully equivalent: */}
      {/*        <Route path='/login' component={LoginPage}/> */}
      <Route path='/login'>
        <LoginPage/>
      </Route>
      <Route path='/' render={()=><Redirect to={{pathname:'/main'}}/>}/>
    </Switch>
  );
}

const PrivateRoute = wrapContexts(function ({ children, ...rest }) {
  console.log('inside private route');
  console.log(rest);
  return (
    <Route
      {...rest}
        render={function ({ location }) {
            console.log(`inside render of private route, username is ${rest.loginContext.username}`);
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
});

