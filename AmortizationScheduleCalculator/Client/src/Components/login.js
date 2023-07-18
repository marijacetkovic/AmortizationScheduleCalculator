import React from 'react';
import './stylesForm.css';
import axios from 'axios';

class LoginForm extends React.Component {

    constructor(props) {
      super(props);
      
      this.state = {
        isActive:false,
        name: "login",
          user: {
            email: "",
            password: ""
          }
        
      };
    }

    handleShow = ()=>{
      this.setState({
          isActive: true
      })
    };

    handleHide = () =>{
        this.setState({
            isActive: false
        })
    };

    QSetView = (obj) => {
      this.setState({
        CurrentPage: obj.page
      });
    };

    QSetViewInParent = (obj) => {
          this.props.QIDFromChild(obj);
    };

    QGetTextFromField = (e) => {
      this.setState((prevState) => ({
        user: { ...prevState.user, [e.target.name]: e.target.value }
      }));
    };
  
    QSentUserToParent = () => {
      this.props.QUserFromChild(this.state.user);
    };

    QPostLogin=()=>{
      axios.post('https://localhost:7224/UserRegistration/login',{
        email:this.state.user.email,
        password:this.state.user.password
      },{withCredentials:true})
      .then(response=>{
        console.log("Sent to server...")
        this.QSendUser2Parent(response.data[0])
      })
      .catch(err=>{
        console.log(err)
      })
    }
    QSendUser2Parent=(obj)=>{
      this.props.QUserFromChild(obj)
    } 
 

      render(){

        return(
          <div>

          <div className="wrappera">
            <div className="form-wrappera">
              <h1 className="h1a">Login</h1>
              <br></br>
              <form className="forma" >
                
                <div className="emaila">
                  <label className="labela" htmlFor="email">Email</label>
                  <input
                    onChange={(e) => this.QGetTextFromField(e)}
                    placeholder="Email"
                    type="email"
                    name="email"
                  />
                </div>
                <div className="passworda">
                  <label className="labela" htmlFor="password">Password</label>
                  <input
                    onChange={(e) => this.QGetTextFromField(e)}
                    placeholder="Password"
                    type="password"
                    name="password"
                  />
                </div>
                <div className="createAccounta">
                  <button onClick={() => this.QPostLogin()} className="buttona" type="submit">Login</button>
                  <a onClick={(e) => this.QSetViewInParent({ page: "registration" })} ><small> Don't have an account?</small></a>
                </div>
              </form>
            </div>
          </div> 
      </div>
      
    ) ;      
 }
}
export default LoginForm;