import logo from './logo.svg';
import React,{ useEffect, useState } from "react";
import './App.css';
import Header from './Components/header';
import RegistrationForm from './Components/registrationForm';
import Home from './Components/home';
import Profile from './Components/profile';
import Login from './Components/login';

class App extends React.Component {
  ///The constructor of our app.
  constructor(props) {
    super(props);
    //state is where our "global" variable will be store
    this.state = { currentPage: "none" };
  }
 
  QSetView = (obj) => {
    this.setState({
      CurrentPage: obj.page
    });
  };

  QGetView = (state) => {

    let page = state.CurrentPage;

    switch (page) {
      case "profile":
        return <Profile/>;
      case "registration":
        return <RegistrationForm/>;
      case "home":
        return <Home />;
      case "login":
          return <Login />;
    };
  };
  QHandleUserLog = (obj) => {
    this.QSetView({ page: "home" });
  };

  render(){
  return (
    
    <div className="App">
      <ul class="nav nav-pills nav-fill gap-2 p-1 small bg-primary rounded-0 shadow-sm" id="pillNav2" role="tablist">
         <li class="nav-item" role="presentation">
            <button class="nav-link active rounded-0" id="home-tab2" data-bs-toggle="tab" type="button" role="tab" aria-selected="true">Home</button>
         </li>
         <li class="nav-item" role="presentation">
            <button onClick={() => this.QSetView({ page: "login" })} class="nav-link rounded-0" id="profile-tab2" data-bs-toggle="tab" type="button" role="tab" aria-selected="false">Profile</button>
         </li>
         <li class="nav-item" role="presentation">
            <button onClick={() => this.QSetView({ page: "registration" })} class="nav-link rounded-0" id="contact-tab2" data-bs-toggle="tab" type="button" role="tab" aria-selected="false">Registration</button>
         </li>
      </ul>

      <div id="viewer" >
            {this.QGetView(this.state)}
      </div>
      
    </div>
  );
  }
}

export default App;