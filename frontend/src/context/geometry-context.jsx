import React, {Component, createContext} from 'react'


export const GeometryContext =  createContext();




class GeometryContextProvider extends Component {

  constructor(props) {
    super(props);
    this.state =  {
      screen: this.getViewPortInfo()
      , geometry: {
        headerBarHeight: 50
      }
    };
    this.handleResize = _.throttle(this.handleResize.bind(this), 250);    
  }

  getViewPortInfo = () => {
    return {height: $(window).height()}
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  handleResize() {
    this.setState({screen: this.getViewPortInfo()});
  }
  

  render() {
    console.log('GeometryContextProvider::render()', {...this.state});
    return (
      <GeometryContext.Provider value={{...this.state}}>
        { this.props.children }
      </GeometryContext.Provider>
    );
  }


}


export default GeometryContextProvider;
