import React from 'react';
import './style.css';
import axios from 'axios';

class RegistrationForm extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
          user: {
            type: "signup"
            }, data: []
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
    
    QPostSignup = () => {
        const profile = {};
        profile['name'] = this.state.user.name;
        profile['surname'] = this.state.user.surname;
        profile['email'] = this.state.user.email;
        profile['user_Password'] = this.state.user.user_Password;

        axios.post('https://localhost:7224/UserRegistration/register',profile)
            .then(response => {
                console.log("Sent to server...")
            })
            .catch(err => {
                console.log(err)
            })

        this.props.QIDFromChild({ page: "login" })
    };
    

    QSetViewInParent = (obj) => {
        this.props.QIDFromChild(obj);
      };

    render(){
    return(
    <div  className= "center" >
      <div className="form">
    
          <div className="form-body">
              <div className="username">
                  <label className="form__label" >First Name </label>
                  <input onChange={(e) => this.QGetTextFromField(e)} name ="name"  className="form__input" type="text" id="firstName" placeholder="First Name"/>
              </div>
              <div className="lastname">
                  <label className="form__label" >Last Name </label>
                  <input onChange={(e) => this.QGetTextFromField(e)} type="text" name="surname" id="lastName"  className="form__input"placeholder="LastName"/>
              </div>
              <div className="email">
                  <label className="form__label" >Email </label>
                  <input onChange={(e) => this.QGetTextFromField(e)} name ="email" type="email" id="email" className="form__input" placeholder="Email"/>
              </div>
              <div className="password">
                  <label className="form__label" >Password </label>
                  <input onChange={(e) => this.QGetTextFromField(e)} name ="user_Password" className="form__input" type="password"  id="password" placeholder="Password"/>
              </div>
          </div>
          <div className="footer">
              <button type="submit" className="btn btn-primary" onClick={() => this.QPostSignup()}  > Register</button>
          </div>

          
      </div>   
      </div>   
    ) 
}      
}
export default RegistrationForm;