const React = require('react');

import {
  useHistory,
  useLocation
} from 'react-router-dom';

import LoginForm from './login-form.jsx';
import SynelixisLogo from '../../resources/synelixis-logo-300x66.png';
import wrapContexts from '../../context/contexts-wrapper.jsx';

function LoginPage(props) {
  let location = useLocation();
  const referrer = location.state?location.state.from:'/main';
  const history = useHistory();

  return (
    <div style={{display: 'flex'
               , flexDirection: 'column'
               , justifyContent: 'center'
               , alignItems: 'center'
               , height: `{this.props.geometryContext.screen.height}px`}}> {/* TODO: obtain height from geometry  */}
    {/* TODO: it is not clear to me why in the below element I have to explicitly
      *       constrain the width, whereas in the modal dialog version no width
      *       constraint is provided, and yet the form does not occupy the entire
      *       screen.
      */}

      {/* TODO: add the flair of the muni */}
      {/* TODO: add the Logo of the application  */}
      <a href='https://www.synelixis.com'>
        <img src={SynelixisLogo}/> 
      </a>
      <div style={{marginTop: '5em'}}>You need to login in order to access this application</div>
      <div style={{marginTop: '3em', width: '25em'}}> 
        <LoginForm followupFunc={()=>{history.replace(referrer);}}/>
      </div>
    </div>
  );
}

export default wrapContexts(LoginPage);
