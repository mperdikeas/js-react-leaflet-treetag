const React = require('react');

import {GeometryContext} from './geometry-context.jsx';
import {LoginContext}    from './login-context.jsx';

export const wrapGeometryContext = (Component) => (
  props => (
    <GeometryContext.Consumer>
      {context => <Component geometryContext={context} {...props} />}
    </GeometryContext.Consumer>
  )
);

export const wrapLoginContext = (Component) => (
  props => (
    <LoginContext.Consumer>
      {context => <Component loginContext={context} {...props} />}
    </LoginContext.Consumer>
  )
);


export default function wrapContexts(Component) {
  return wrapLoginContext(wrapGeometryContext(Component));
}
