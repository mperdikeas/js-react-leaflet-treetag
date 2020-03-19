const React = require('react');

import {wrapLoginContext} from './context/contexts-wrapper.jsx';

function UserControl(props) {
  const username = props.loginContext.username;
  return (
    <>
    {username===null?'guest':username}
    </>
    );
}


export default wrapLoginContext(UserControl);
