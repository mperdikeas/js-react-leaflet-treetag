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
        this.setState({treesConfiguration, healthStatuses, activities});
        
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
