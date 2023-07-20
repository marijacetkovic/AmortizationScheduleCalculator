import React from "react";
import './App.css';
import axios from "axios";
import Home from './Components/home';
import Profile from './Components/profile';
import Login from './Components/login';
import RegForm from "./Components/RegisForm";
import Schedule from "./Components/schedule";
import Calculation from "./Components/calculation";
import { BrowserRouter as Router } from "react-router-dom";


class App extends React.Component {

  ///The constructor of our app.
  constructor(props) {
    super(props);
    //state is where our "global" variable will be store
      this.state = { CurrentPage: "login" };
  }
 
  QGetView = (state) => {

    let page = state.CurrentPage;

    switch (page) {
      case "profile":
        return <Profile QIDFromChild={this.QSetView}/>;
      case "home":
        return <Home QIDFromChild={this.QSetView}/>;
      case "login":
          return <Login QIDFromChild={this.QSetView}/>;
      case "registration":
            return <RegForm QIDFromChild={this.QSetView}/>;
      case "Schedule":
        return <Schedule QIDFromChild={this.QSetView}/>;
      case "calculation":
          return <Calculation QIDFromChild={this.QSetView}/>;
      default:
          return <Login/>;

    }
  };
  QSetView = (obj) => {
    this.setState({
      CurrentPage: obj.page
    });
  };


  QSetUser=(obj)=>{
    this.setState({
      userStatus:{logged:true,user:[obj]}
    })
   };


  render(){

      return (
          <Router> 
    
            <div className="App">


              <div id="viewer">
                {this.QGetView(this.state)}
              </div>
              </div>
          </Router>
  );
  }
}

export default App;