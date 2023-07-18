import React, { Component } from "react";
import "./stylesForm.css";
import axios from "axios";

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach((val) => {
    val === null && (valid = false);
  });

  return valid;
};

class Forma extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstname: null,
      surname: null,
      email: null,
      user_Password: null,
      formErrors: {
        firstname: "",
        surname: "",
        email: "",
        user_Password: ""
      }
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        First Name: ${this.state.firstname}
        Last Name: ${this.state.surname}
        Email: ${this.state.email}
        Password: ${this.state.user_Password}
      `);
    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "firstname":
        formErrors.firstname =
          value.length < 3 ? "minimum 3 characaters required" : "";
        break;
      case "surname":
        formErrors.surname =
          value.length < 3 ? "minimum 3 characaters required" : "";
        break;
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "invalid email address";
        break;
      case "user_Password":
        formErrors.user_Password =
          value.length < 6 ? "minimum 6 characaters required" : "";
        break;
      default:
        break;
    }

    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };

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
    profile['firstname'] = this.state.user.firstname;
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

  QSetView = (obj) => {
      this.setState({
        CurrentPage: obj.page
    });
  };



  render() {
    const { formErrors } = this.state;

    return (
      <div className="wrappera">
        <div className="form-wrappera">
          <h1 className="h1a">Create Account</h1>
          <br></br>
          <form className="forma" onSubmit={this.handleSubmit} noValidate>
            <div className="firstNamea">
              <label className="labela" >First Name</label>
              <input
                className={formErrors.firstname.length > 0 ? "error" : null}
                placeholder="First Name"
                type="text"
                name="firstname"
                noValidate
                onChange={(e) => {this.handleChange(e);this.QGetTextFromField(e)}}
              />
              {formErrors.firstname.length > 0 && (
                <span className="errorMessagea">{formErrors.firstname}</span>
              )}
            </div>
            <div className="lastNamea">
              <label className="labela">Last Name</label>
              <input
                className={formErrors.surname.length > 0 ? "error" : null}
                placeholder="Last Name"
                type="text"
                name="surname"
                noValidate
                onChange={(e) => {this.handleChange(e);this.QGetTextFromField(e)}}
              />
              {formErrors.surname.length > 0 && (
                <span className="errorMessagea">{formErrors.surname}</span>
              )}
            </div>
            <div className="emaila">
              <label className="labela">Email</label>
              <input
                className={formErrors.email.length > 0 ? "error" : null}
                placeholder="Email"
                type="email"
                name="email"
                noValidate
                onChange={(e) => {this.handleChange(e);this.QGetTextFromField(e)}}
              />
              {formErrors.email.length > 0 && (
                <span className="errorMessagea">{formErrors.email}</span>
              )}
            </div>
            <div className="passworda">
              <label className="labela">Password</label>
              <input
                className={formErrors.user_Password.length > 0 ? "error" : null}
                placeholder="Password"
                type="password"
                name="user_Password"
                noValidate
                onChange={(e) => {this.handleChange(e);this.QGetTextFromField(e)}}
              />
              {formErrors.user_Password.length > 0 && (
                <span className="errorMessagea">{formErrors.user_Password}</span>
              )}
            </div>
            <div className="createAccounta">
              <button onClick={() => this.QSetViewInParent({ page: "login" })} className="buttona" type="submit">Submit</button>
              <a onClick={() => this.QSetViewInParent({ page: "login" })} > <small > Already Have an Account?</small> </a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Forma;
