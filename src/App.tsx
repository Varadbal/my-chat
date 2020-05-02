import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {Login} from './Login';
import { Main } from './Main';
import { proxy } from './Proxy';

export default class App extends Component 
{
  state={loggedIn:false};
  render()
  {
    return (
      <div className="app">
        { !this.state.loggedIn && 
          <Login />
        }
        {
          this.state.loggedIn &&
          <Main />
        }
      </div>
    );
  }

  componentDidMount()
  {
    proxy.addEventListener("login", () => {
      this.setState({loggedIn: true});
    }, this);   
  }
  componentWillUnmount()
  {
    proxy.removeAllEventListener(this);
  }
}

