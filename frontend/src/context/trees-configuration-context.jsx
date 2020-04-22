import React, {createContext} from 'react'


export const TreesConfigurationContext =  createContext();


import {wrapLoginContext} from './contexts-wrapper.jsx';

import getTreesConfiguration from '../trees-configuration-reader.js';

class TreesConfigurationContextProvider extends React.Component {

  constructor(props) {
    super(props);
    this.state =  {
      treesConfiguration: null
      , healthStatuses: null
      , activities: null
    }
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if ((prevProps.loginContext.username === null) && (this.props.loginContext.username!=null)) {
      // we're now logged-in and can obtain the trees configuration
      getTreesConfiguration().then( (configuration) => {
        console.log(configuration);
        const {treesConfiguration, healthStatuses, activities} = configuration;
        console.log(healthStatuses);
        this.setState({treesConfiguration
                     , healthStatuses: healthStatusesMap(healthStatuses)
                     , activities});
        
      });
    }
  }


  render() {
    console.log('TreesConfigurationContextProvider::render()', {...this.state});
    return (
      <TreesConfigurationContext.Provider value={this.state}>
      { this.props.children }
      </TreesConfigurationContext.Provider>
    );
  }


}
export default wrapLoginContext(TreesConfigurationContextProvider);


/**
 * place the key value pairs of an object in a Map with the order of
 * insertion being such that the smallest keys are inserted first
 *
 */
function healthStatusesMap(healthStatuses) {
  const keyvaluepairs = []
  const rv = new Map()
  for (var prop in healthStatuses) {
    if (Object.prototype.hasOwnProperty.call(healthStatuses, prop)) {
      keyvaluepairs.push({key: prop, value: healthStatuses[prop]});
    }
  }
  keyvaluepairs.sort( (a, b) => {
    return a.key - b.key;
  });
  keyvaluepairs.forEach ( (v) => {
    rv.set(v.key, v.value);
  });
  return rv;
}

