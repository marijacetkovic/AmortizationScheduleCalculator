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

    handleSubmit = () => {
        if (formValid(this.state)) {
            console.log(`
        --SUBMITTING--
        First Name: ${this.state.firstname}
        Last Name: ${this.state.surname}
        Email: ${this.state.email}
        Password: ${this.state.user_Password}
      `);
            this.QPostSignup();
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
                    value.length < 8 ? "minimum 8 characaters required" : "";
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
        profile['name'] = this.state.user.firstname;
        profile['surname'] = this.state.user.surname;
        profile['email'] = this.state.user.email;
        profile['user_Password'] = this.state.user.user_Password;

        axios.post('https://localhost:7224/UserRegistration/register', profile)
            .then(response => {
                console.log("Sent to server...")
                if (response.data === 1) {
                    this.props.QIDFromChild({ page: "login" })
                }
                else {
                    alert("Email already exists.")

                }
            })
            .catch(err => {
                console.log(err)
            })

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
            <div>
                <div className="container">
                    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                        <a href="#" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                            <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
                        </a>
                        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                            <li> <div className="uniButton" ><div id="title">Amortization Calculator </div></div> </li>
                        </ul>

                        <div className="col-md-3 text-end">
                            <button type="button" onClick={() => this.QSetViewInParent({ page: "login" })} className="btn btn-outline me-2">Login</button>
                            <button type="button" onClick={() => this.QSetViewInParent({ page: "registration" })} className="btn">Sign-up</button>
                        </div>
                    </header>
                </div>
                <div className="wrappera">

                    <div className="form-wrappera">
                        <h1 className="h1a">Create Account</h1>
                        <br></br>
                        <form className="forma" noValidate>
                            <div className="firstNamea">
                                <label className="labela" >First Name</label>
                                <input
                                    className={formErrors.firstname.length > 0 ? "error" : null}
                                    placeholder="First Name"
                                    type="text"
                                    name="firstname"
                                    noValidate
                                    onChange={(e) => { this.handleChange(e); this.QGetTextFromField(e) }}
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
                                    onChange={(e) => { this.handleChange(e); this.QGetTextFromField(e) }}
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
                                    onChange={(e) => { this.handleChange(e); this.QGetTextFromField(e) }}
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
                                    onChange={(e) => { this.handleChange(e); this.QGetTextFromField(e) }}
                                />
                                {formErrors.user_Password.length > 0 && (
                                    <span className="errorMessagea">{formErrors.user_Password}</span>
                                )}
                            </div>
                            <div className="createAccounta">
                                <button onClick={() => { this.handleSubmit() }} className="buttona" type="button">Submit</button>
                                <a onClick={() => this.QSetViewInParent({ page: "login" })} > <small > Already Have an Account?</small> </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Forma;