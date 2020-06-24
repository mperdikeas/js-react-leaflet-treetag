import React from 'react';

import {GeometryContext}              from './geometry-context.tsx';
import {LoginContext}                 from './login-context.tsx';


export const wrapGeometryContext = (Component: React.ComponentType<any>): React.ComponentType<any> => (
  (props: any) => (
    <GeometryContext.Consumer>
      {context => <Component geometryContext={context} {...props} />}
    </GeometryContext.Consumer>
  )
);

export function wrapLoginContext(Component: React.ComponentType<any>) : React.ComponentType<any>{
  return (
    (props: any) => (
      <LoginContext.Consumer>
        {context => <Component loginContext={context} {...props} />}
      </LoginContext.Consumer>
    )
  );
}

export default function wrapContexts(Component: React.ComponentType<any>): React.ComponentType<any> {
  return wrapLoginContext(wrapGeometryContext(Component));
}


export function foo(x: React.ComponentType<any>): React.ComponentType<any> {
  return x;
  }
