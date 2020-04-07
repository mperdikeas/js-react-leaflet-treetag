import React, {createContext} from 'react'


export const GeometryContext =  createContext();




class GeometryContextProvider extends React.Component {

  constructor(props) {
    super(props);
    this.state =  {
      screen: this.getViewPortInfo()
      , geometry: {
        toolbox: {
          iconWidth: 32
          , padding: 3
          , border: 1
          , horizMargin: 5
          }
        , headerBarHeight: 40
        , map: {
          layoutControl: {
            bottomY: 50
            }
          }
        , toastDiv: {
          width: 300
          , marginRight: 10
          }
      }
    };
    this.handleResize = _.throttle(this.handleResize.bind(this), 250);    
  }

  getViewPortInfo = () => {
    return {height: $(window).height(), width: $(window).width()}
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  handleResize() {
    this.setState({screen: this.getViewPortInfo()});
  }

  toolboxTotalWidth = () => {
    const {iconWidth, padding, horizMargin, border} = this.state.geometry.toolbox;
    return iconWidth + 2 * (padding + horizMargin) + border;
  }

  topOfToastDiv = () => {
    return this.state.geometry.headerBarHeight+this.state.geometry.map.layoutControl.bottomY;
    }

  leftOfToastDiv = () => {
    return this.state.screen.width-this.state.geometry.toastDiv.width-this.state.geometry.toastDiv.marginRight;
  }
  

  render() {
    console.log('GeometryContextProvider::render()', {...this.state});
    return (
      <GeometryContext.Provider value={{...this.state
                                      , toolboxTotalWidth: this.toolboxTotalWidth
                                      , topOfToastDiv: this.topOfToastDiv
                                      , leftOfToastDiv: this.leftOfToastDiv}}>
        { this.props.children }
      </GeometryContext.Provider>
    );
  }


}


export default GeometryContextProvider;
