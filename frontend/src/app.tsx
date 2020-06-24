import React from 'react';

import {
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from 'react-router-dom';


import LandingPageContainer from './landing-page-container.tsx';



import MainMapContainer from './main-map-container.jsx';
import RegionMgmnt from './region-mgmnt.jsx';
import RegionOverlaps from './region-overlaps.jsx';
import About            from './about.jsx';
import LoginPage        from './components/login/login-page.jsx';

import ToastsStack                             from './components/toasts/toasts-stack.jsx';
import ModalRoot                               from './modal-root.jsx';




// TODO: maybe I should implement different context wrappers for each individual context
import wrapContexts from './context/contexts-wrapper.tsx';

export default function App() {

  if (false)
  return (
    <Switch>
      <PrivateRoute exact path='/main'>
        <LandingPageContainer/>
      </PrivateRoute>
    </Switch>   
  );
  
  
  return (
    <ModalRoot>
      <ToastsStack>

        <Switch>
          <PrivateRoute exact path='/main'>
            <LandingPageContainer/>
          </PrivateRoute>
          <PrivateRoute exact path='/main/map'>          
            <MainMapContainer/>
          </PrivateRoute>
          <PrivateRoute exact path='/main/regions/definition'>
            <RegionMgmnt/>
          </PrivateRoute>
          <PrivateRoute exact path='/main/regions/overlaps'>
            <RegionOverlaps/>
          </PrivateRoute>          
          <Route exact path='/about'>
            <About/>
          </Route>
          <Route exact path='/login'>
            <LoginPage/>
          </Route>
          <Route path='/' render={()=><Redirect to={{pathname:'/main'}}/>}/>
        </Switch>
      </ToastsStack>
    </ModalRoot>

  );

}



interface HasLocation {
  location: string;
}

const PrivateRoute = wrapContexts(function ({ children, ...rest }: any) {
  return (
    <Route
      {...rest}
        render={function ({ location }: HasLocation) {
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


