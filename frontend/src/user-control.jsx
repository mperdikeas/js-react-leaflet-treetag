const React = require('react');

import {wrapLoginContext} from './context/contexts-wrapper.tsx';

function UserControl(props) {
  const username = props.loginContext.username;
  return (
    <>
    {username===null?'guest':username}
    </>
    );
}


export default wrapLoginContext(UserControl);
