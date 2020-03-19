import React, {createContext} from 'react'


export const LoginContext =  createContext();




class LoginContextProvider extends React.Component {

  constructor(props) {
    super(props);
    this.state =  {
      username: null
    }
  }

  componentDidMount() {
  }

  updateLogin = (username) => {
    this.setState({username});
    };

  render() {
    console.log('LoginContextProvider::render()', {...this.state});
    return (
      <LoginContext.Provider value={{...this.state, updateLogin: this.updateLogin}}>
        { this.props.children }
      </LoginContext.Provider>
    );
  }


}


export default LoginContextProvider;
