import React from 'react';
import './style.css';
import axios from 'axios';

class RegistrationForm extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
          user: {
            type: "signup"
          }
        };
      }

      QGetTextFromField = (e) => {
        this.setState((prevState) => ({
          user: { ...prevState.user, [e.target.name]: e.target.value }
        }));
      };
    
      QSentUserToParent = () => {
        this.props.QUserFromChild(this.state.user);
      };
    
      QPostSignup=()=>{
    
        axios.post('https://localhost:7224/UserRegistration/register',{
          name:this.state.user.name,
          surname:this.state.user.surname,
          email:this.state.user.email,
          user_Password:this.state.user.user_Password
        })
        .then(response=>{
          console.log("Sent to server...")
        })
        .catch(err=>{
          console.log(err)
        })
    
        this.props.QIDFromChild({page: "home"})
      }
    

    QSetViewInParent = (obj) => {
        this.props.QIDFromChild(obj);
      };

    render(){
    return(
    <div  className= "center" >
      <div className="form">
    
          <div className="form-body">
              <div className="username">
                  <label className="form__label" for="firstName">First Name </label>
                  <input onChange={(e) => this.QGetTextFromField(e)} name ="name"  className="form__input" type="text" id="firstName" placeholder="First Name"/>
              </div>
              <div className="lastname">
                  <label className="form__label" for="lastName">Last Name </label>
                  <input onChange={(e) => this.QGetTextFromField(e)} type="text" name="surname" id="lastName"  className="form__input"placeholder="LastName"/>
              </div>
              <div className="email">
                  <label className="form__label" for="email">Email </label>
                  <input onChange={(e) => this.QGetTextFromField(e)} name ="email" type="email" id="email" className="form__input" placeholder="Email"/>
              </div>
              <div className="password">
                  <label className="form__label" for="password">Password </label>
                  <input onChange={(e) => this.QGetTextFromField(e)} name ="user_Password" className="form__input" type="password"  id="password" placeholder="Password"/>
              </div>
          </div>
          <div class="footer">
              <button type="submit" class="btn btn-primary" onClick={() => this.QPostSignup()}  > Register</button>
          </div>

          
      </div>   
      </div>   
    ) 
}      
}
export default RegistrationForm;