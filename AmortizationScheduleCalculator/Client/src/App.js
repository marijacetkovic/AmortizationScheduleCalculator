import React from "react";
import './App.css';
import RegistrationForm from './Components/registrationForm';
import Home from './Components/home';
import Profile from './Components/profile';
import Login from './Components/login';


class App extends React.Component {

  ///The constructor of our app.
  constructor(props) {
    super(props);
    //state is where our "global" variable will be store
    this.state = { currentPage: "home", userStatus:{logged:false}};
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
        return <Profile QIDFromChild={this.QSetView}/>;
      case "registration":
        return <RegistrationForm QIDFromChild={this.QSetView}/>;
      case "home":
        return <Home QIDFromChild={this.QSetView}/>;
      case "login":
          return <Login QIDFromChild={this.QSetView}/>;
    };
  };

  QSetUser=(obj)=>{
    this.setState({
      userStatus:{logged:true,user:[obj]}
    })
   }

  QHandleUserLog = (obj) => {
    this.QSetView({ page: "home" });
  };

  //for registration
  //async componentDidMount(){
    //fetch('')
    //  .then(response => response.json())
    //  .then(data => console.log(data))

    //try{
     //const response = await fetch('https://localhost:7224/UserRegistration/register')
      //const data = await response.json();
      //console.log(data)
   // }
   // catch(err){
    //  console.log(err);
    //}

 // };

  render(){

  return (
    
    <div className="App">

    <div className="container">
    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <a href="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
        <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
      </a>

      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li><a href="#" className="nav-link px-2 link-dark">Home</a></li>
        <li><a href="#" className="nav-link px-2 link-dark">About</a></li>
        <li onClick={() => this.QSetView({ page: "profile" })}><a href="#" className="nav-link px-2 link-dark">Profile</a></li>
      </ul>

      <div className="col-md-3 text-end">
        <button type="button"  onClick={() => this.QSetView({ page: "login" })} className="btn btn-outline-primary me-2">Login</button>
        <button type="button" onClick={() => this.QSetView({ page: "registration" })} className="btn btn-primary">Sign-up</button>
      </div>
    </header>
    </div>

    <div style={{height: "90%"}} >
            {this.QGetView(this.state)}
      </div>
      
    </div>
  );
  }
}

export default App;