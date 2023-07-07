import React, {useState} from 'react';
import './style.css'
class LoginForm extends React.Component {


    QSetViewInParent = (obj) => {
        this.props.QIDFromChild(obj);
      };

      QSetView = (obj) => {
        this.setState({
          CurrentPage: obj.page
        });
      };
    

    render(){
    return(
    <div className="center">
      <div className="form">
        
          <div className="form-body">
    
              <div className="email">
                  <label className="form__label" for="email">Email </label>
                  <input  type="email" id="email" className="form__input" placeholder="Email"/>
              </div>
              <div className="password">
                  <label className="form__label" for="password">Password </label>
                  <input className="form__input" type="password"  id="password" placeholder="Password"/>
              </div>

          </div>
          <div class="footer">
              <button type="submit" class="btn">Login</button>
          </div>

          <div className="here"
          >
            Don't have an account?
          </div>

          <a className="here" href="#">Register here</a>
      </div> 
      </div>     
    )       
}
}
export default LoginForm;