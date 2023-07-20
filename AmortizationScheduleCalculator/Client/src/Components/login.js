import React from 'react';
import './stylesForm.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

class LoginForm extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            isActive: false,
            name: "login",
            user: {
                email: "",
                password: ""
            },
            token: "",
        };

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

    QPostLogin = () => {

        axios.post('https://localhost:7224/UserRegistration/login', {
            email: this.state.user.email,
            password: this.state.user.password
        })
            .then(response => {
                this.setState({ token: response.data }, () => {
                     this.QGetCalculation();
                });
                
               
            })
           
            .catch(err => {
                console.log(err)
                alert("User does not exist!")
            })
    };
  //{ withCredentials: true }

    QGetCalculation = () => {
        axios.get('https://localhost:7224/CalculateAmortizationPlan', {
            headers: {
                Authorization: `Bearer ${this.state.token}`
            
            }
        })
            .then(response => {
                this.props.QIDFromChild({ page: "profile" })
            }).catch(err => {
                this.props.QIDFromChild({ page: "login" });
            })
    };

 

      render(){

        return(
          <div>

            <div className="container">
                  <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                    <a href="#" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                      <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
                    </a>

                    <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                            <li>
                                <button className="uniButton">
                                    <div id="title">Amortization Calculator</div>
                                </button>
                            </li>
                        </ul>

                  <div className="col-md-3 text-end">
                      <button type="button" onClick={() => this.QSetViewInParent({ page: "login" })} className="btn btn-outline me-2">Login</button>
                      <button type="button" onClick={() => this.QSetViewInParent({ page: "registration" })} className="btn">Sign-up</button>
                  </div>
                  </header>
              </div> 

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
                  <button onClick={() => this.QPostLogin()} className="buttona" type="button">Login</button>
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