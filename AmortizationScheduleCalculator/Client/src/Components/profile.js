import React from "react";
import './style.css';
import axios from "axios";

class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            calculation: {},
            localEdited: [],
            errorMessages: {
                nameFor: '',
                amount: "",
                period: "",
                start: "",
                rate: ""

            }
        };
    };


    QGetTextFromField = (e) => {
        this.setState((prevState) => ({
            calculation: { ...prevState.calculation, [e.target.name]: e.target.value }
        }));
    };

    validateInput = () => {
        const {nameFor, amount, period, start, rate } = this.state.calculation;
        const errorMessages = {};

        if (!nameFor || nameFor.trim().length === 0 || !amount  || amount.trim().length === 0 || !period || period.trim().length === 0|| !start || start.trim().length ===0 || !rate || rate.trim().length===0 ) {
            errorMessages.error = 'Required fields cannot be empty.';
        }
        
        // Add validations for other input fields if needed...

        this.setState({ errorMessages });

        // Return true if all fields are valid, otherwise return false
        return !Object.values(errorMessages).some((message) => message);
    };

    //put the fields
    QPostField = () => {

        const isValid = this.validateInput();
        console.log(isValid)
        if (!isValid) {
            // Handle form validation errors
            //alert('Please fill in all required fields correctly.');
            return;
        }
        
        axios.post('https://localhost:7224/CalculateAmortizationPlan',
            {
                request_Id: 0,
                request_Name: this.state.calculation.nameFor,
                loan_Amount: this.state.calculation.amount,
                loan_Period: this.state.calculation.period,
                interest_Rate: this.state.calculation.rate,
                loan_Start_Date: this.state.calculation.start,
                approval_Cost: this.state.calculation.approval,
                insurance_Cost: this.state.calculation.insurance,
                account_Cost: this.state.calculation.account,
                other_Costs: this.state.calculation.costs,
                monthly_Payment: 0,
                total_Interest_Paid: 0,
                total_Loan_Cost: 0,
                loan_Payoff_Date: "2023-07-19T07:22:56.004Z",
                r_User_Id: 0
            },
            {
                headers: {

                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                console.log(response.data)
                console.log("Sent to server...")
                this.props.QIDFromChild({
                    page: "calculation", sum: response.data.summary, schedules: response.data.schedules,
                    idForSchedule: response.data.summary.request_Id, loan: response.data.summary.loan_Amount, loanperiod: response.data.summary.loan_Period,
                    loanStart: response.data.summary.loan_Start_Date, interestR: response.data.summary.interest_Rate, appC: response.data.summary.approval_Cost, insC: response.data.summary.insurance_Cost,
                    otherC: response.data.summary.other_Costs
                })
            })
            .catch(err => {
                console.log(err)
                console.log(err.response.data);
                 //const errorMessage = err.response?.data?.message; // Access the error message from the response data
                 //if (err.response.data === "Minimal loan amount is 1,000€.") {
                 //    alert("Minimal loan amount is 1,000€.")
                 //    return;
                 //}
                alert(err.response.data)

            })
        this.props.QIDFromChild({ page: "profile" })
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
        const { errorMessages } = this.state;
        const name = localStorage.getItem('name');
        const surname = localStorage.getItem('surname');
        const edited = this.props.editSchedule;

        console.log(edited)

       // if (edited === []) {

            return (
                <div>

                    <div className="container">
                        <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-3 border-bottom">
                            <div className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                                </svg>
                                <div>{name} {" "} {surname}</div>

                            </div>


                            <div id="title">Amortization Calculator </div>


                            <div className="col-md-3 text-end">
                                <button type="button" onClick={() => this.QSetViewInParent({ page: "history" })} className="btn btn-outline me-2">History</button>
                                <button type="button" onClick={() => { this.QSetViewInParent({ page: "login" }); localStorage.setItem('token', ""); localStorage.setItem('name', ""); localStorage.setItem('surname', "") }} className="btn">Logout</button>
                            </div>
                        </header>
                    </div>
                    <br></br>

                    <div className="centerDiv">
                        <form id="formH">


                            <div className="form-floating">
                                <input onChange={(e) => this.QGetTextFromField(e)} type="text" className="form-control" id="floatingInput" placeholder="" name="nameFor" style={{ paddingLeft: '25px' }} ></input>

                                <label>Request name</label>
                                
                            </div>

                            <div className="form-floating">
                                <span className="spanInput">
                                    €
                                </span>
                                <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingInput" placeholder="" name="amount" style={{ paddingLeft: '25px' }} min={1}></input>
                                <label>Loan amount</label>
                            </div>

                            <div className="form-floating">
                                <span className="spanInputPeriod">
                                    years
                                </span>
                                <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingPassword" placeholder="" name="period" style={{ paddingLeft: '25px' }} min={1}></input>
                                <label>Loan period</label>
                            </div>

                            <div className="form-floating">

                                <input onChange={(e) => { this.QGetTextFromField(e) }} type="date" className="form-control" id="floatingDate" placeholder="" name="start" style={{ paddingLeft: '25px' }}></input>

                                <label>Loan start</label>
                            </div>

                            <div className="form-floating">
                                <span className="spanInput"
                                >
                                    %
                                </span>
                                <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingRate" placeholder="" name="rate" style={{ paddingLeft: '25px' }} min={1}></input>
                                <label>Interest rate</label>
                            </div>

                            <div className="form-floating">
                                <span className="spanInput">
                                    €
                                </span>
                                <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingApproval" placeholder="" name="approval" style={{ paddingLeft: '25px' }} min={1}></input>
                                <label>Approval</label>
                            </div>

                            <div className="form-floating">
                                <span className="spanInput">
                                    €
                                </span>
                                <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingInsurance" placeholder="" name="insurance" style={{ paddingLeft: '25px' }} min={1}></input>
                                <label>Insurance</label>
                            </div>

                            <div className="form-floating">
                                <span className="spanInput">
                                    €
                                </span>
                                <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingAccount" placeholder="" name="account" style={{ paddingLeft: '25px' }} min={1}></input>
                                <label>Account</label>
                            </div>

                            <div className="form-floating">
                                <span className="spanInput">
                                    €
                                </span>
                                <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingCosts" placeholder="" name="costs" style={{ paddingLeft: '25px' }} min={1}></input>
                                <label>Other costs</label>
                            </div>

                            {errorMessages.error && <div style={{ color: 'red' }}>{errorMessages.error}</div>}

                            <br></br>

                            <button onClick={() => this.QPostField()} className="buttona" type="button">Calculate</button>

                        </form>
                    </div>

                </div>
            );
       // }

        //else {

        //    return (
        //        <div>

        //            <div className="container">
        //                <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-3 border-bottom">
        //                    <div className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
        //                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
        //                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
        //                        </svg>
        //                        <div>{name} {" "} {surname}</div>

        //                    </div>


        //                    <div id="title">Amortization Calculator </div>


        //                    <div className="col-md-3 text-end">
        //                        <button type="button" onClick={() => this.QSetViewInParent({ page: "history" })} className="btn btn-outline me-2">History</button>
        //                        <button type="button" onClick={() => { this.QSetViewInParent({ page: "login" }); localStorage.setItem('token', ""); localStorage.setItem('name', ""); localStorage.setItem('surname', "") }} className="btn">Logout</button>
        //                    </div>
        //                </header>
        //            </div>
        //            <br></br>




        //            <div className="centerDiv">
        //                <form id="formH">


        //                    <div className="form-floating">
        //                        <input onChange={(e) => this.QGetTextFromField(e)} type="text" className="form-control" id="floatingInput" placeholder="" name="nameFor" style={{ paddingLeft: '25px' }} value={this.props.editSchedule.request_Name} ></input>

        //                        <label>Request name</label>
        //                    </div>

        //                    <div className="form-floating">
        //                        <span className="spanInput">
        //                            €
        //                        </span>
        //                        <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingInput" placeholder="" name="amount" style={{ paddingLeft: '25px' }} min={1}></input>
        //                        <label>Loan amount</label>
        //                    </div>

        //                    <div className="form-floating">
        //                        <span className="spanInputPeriod">
        //                            years
        //                        </span>
        //                        <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingPassword" placeholder="" name="period" style={{ paddingLeft: '25px' }} min={1}></input>
        //                        <label>Loan period</label>
        //                    </div>

        //                    <div className="form-floating">

        //                        <input onChange={(e) => { this.QGetTextFromField(e) }} type="date" className="form-control" id="floatingDate" placeholder="" name="start" style={{ paddingLeft: '25px' }}></input>

        //                        <label>Loan start</label>
        //                    </div>

        //                    <div className="form-floating">
        //                        <span className="spanInput"
        //                        >
        //                            %
        //                        </span>
        //                        <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingRate" placeholder="" name="rate" style={{ paddingLeft: '25px' }} min={1}></input>
        //                        <label>Interest rate</label>
        //                    </div>

        //                    <div className="form-floating">
        //                        <span className="spanInput">
        //                            €
        //                        </span>
        //                        <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingApproval" placeholder="" name="approval" style={{ paddingLeft: '25px' }} min={1}></input>
        //                        <label>Approval</label>
        //                    </div>

        //                    <div className="form-floating">
        //                        <span className="spanInput">
        //                            €
        //                        </span>
        //                        <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingInsurance" placeholder="" name="insurance" style={{ paddingLeft: '25px' }} min={1}></input>
        //                        <label>Insurance</label>
        //                    </div>

        //                    <div className="form-floating">
        //                        <span className="spanInput">
        //                            €
        //                        </span>
        //                        <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingAccount" placeholder="" name="account" style={{ paddingLeft: '25px' }} min={1}></input>
        //                        <label>Account</label>
        //                    </div>

        //                    <div className="form-floating">
        //                        <span className="spanInput">
        //                            €
        //                        </span>
        //                        <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingCosts" placeholder="" name="costs" style={{ paddingLeft: '25px' }} min={1}></input>
        //                        <label>Other costs</label>
        //                    </div>

        //                    <br></br>

        //                    <button onClick={() => this.QPostField()} className="buttona" type="button">Calculate</button>

        //                </form>
        //            </div>

        //        </div>
        //    );
        //};
    }

}
    

export default Profile;