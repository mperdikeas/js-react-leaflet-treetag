const React = require('react');

import {GeometryContext}              from './geometry-context.jsx';
import {LoginContext}                 from './login-context.jsx';
import {TreesConfigurationContext}    from './trees-configuration-context.jsx';

export const wrapGeometryContext = (Component) => (
  props => (
    <GeometryContext.Consumer>
      {context => <Component geometryContext={context} {...props} />}
    </GeometryContext.Consumer>
  )
);

export function wrapLoginContext(Component) {
  return (
    props => (
      <LoginContext.Consumer>
        {context => <Component loginContext={context} {...props} />}
      </LoginContext.Consumer>
    )
  );
}

export const wrapTreesConfigurationContext = (Component) => (
  props => (
    <TreesConfigurationContext.Consumer>
      {context => <Component treesConfigurationContext={context} {...props} />}
    </TreesConfigurationContext.Consumer>
  )
);


export default function wrapContexts(Component) {
  return wrapLoginContext(wrapTreesConfigurationContext(wrapGeometryContext(Component)));
}
