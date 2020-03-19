const React = require('react');

import {wrapLoginContext} from './context/contexts-wrapper.jsx';

function UserControl(props) {
  const username = props.loginContext.username;
  return (
      <div className='col-2'>
        {username===null?'guest':username}
      </div>
    );
}


export default wrapLoginContext(UserControl);
