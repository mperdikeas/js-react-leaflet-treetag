import React, {createContext} from 'react'


export const LoginContext =  createContext({} as any);

interface IState {
  username: string | null;
}



class LoginContextProvider extends React.Component<any, IState> {

  constructor(props: any) {
    super(props);
    this.state =  {
      username: null
    }
  }

  componentDidMount() {
  }

  updateLogin = (username: string) => {
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
