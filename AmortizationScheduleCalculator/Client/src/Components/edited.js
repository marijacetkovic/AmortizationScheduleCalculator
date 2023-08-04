import React from "react";
import './style.css';
import axios from "axios";

class EditSchedule extends React.Component {

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
                rate: "",
            },
            showPartialPaymentFields: false,
            partialPayments: [],
            formData: [{ key: '', value: '' }, { key: '', value: '' }],
            keyValueStore: {},
            showEarlyPaymentFields: false,
            formDataEarly: [{ key: '', value: '' }, { key: '', value: '' }],
            fee: { fee: "" },
            edit: 0,
            currentReqId:""

        };

        this.validateInput = this.validateInput.bind(this);
    };

    componentDidMount() {
        this.checkTokenExpiry();
    }

    componentDidUpdate() {
        this.checkTokenExpiry();
    }

    redirectToLogin = () => {
        // redirect to the login page and inform the user about the session expiration
        this.props.QIDFromChild({ page: "login" });
        localStorage.setItem('token', "");
        localStorage.setItem('name', "");
        localStorage.setItem('surname', "");
        alert('Your session has expired. Please log in again.');
    };



    checkTokenExpiry() {
        const token = localStorage.getItem('token');
        if (!token) {
            this.redirectToLogin();
            return;
        }



        const tokenExp = this.getTokenExpiration(token);
        const currentTime = Date.now();



        // get time until expiry
        const timeUntilExpiry = tokenExp - currentTime;
        if (timeUntilExpiry > 0) {
            console.log("time untile xpiry" + timeUntilExpiry)
            // check when the token expires
            this.expiryTimeout = setTimeout(this.redirectToLogin, timeUntilExpiry);
        } else {
            this.redirectToLogin();
        }
    }



    componentWillUnmount() {
        // Clear the scheduled timeout when the component unmounts
        clearTimeout(this.expiryTimeout);
    }



    getTokenExpiration(token) {
        try {
            const tokenParts = token.split('.');
            const decodedPayload = JSON.parse(atob(tokenParts[1]));
            console.log("decoded payload" + decodedPayload.exp * 1000)



            return decodedPayload.exp * 1000; // Convert to milliseconds
        } catch (error) {
            return 0;
        }
    }

    handleInputChange = (e, index) => {
        const { name, value } = e.target;
        this.setState((prevState) => {
            const updatedFormData = [...prevState.formData];
            updatedFormData[index] = { ...updatedFormData[index], [name]: value };
            return { formData: updatedFormData };
        });
    };

    handleInputChangeEarly = (e, index) => {
        const { name, value } = e.target;
        this.setState((prevState) => {
            const updatedFormData = [...prevState.formDataEarly];
            updatedFormData[index] = { ...updatedFormData[index], [name]: value };
            return { formDataEarly: updatedFormData };
        });
    };


    handleSubmit = (e) => {
        e.preventDefault();
        const { key, value } = this.state.formData;
        if (key && value) {
            this.setState((prevState) => ({
                keyValueStore: { ...prevState.keyValueStore, [key]: value },
                formData: { key: '', value: '' }, // Clear the input fields after submission
            }));
        }
    };

    togglePartialPaymentFields = () => {
        this.setState((prevState) => ({
            showPartialPaymentFields: !prevState.showPartialPaymentFields,
       }));
    };

    toggleEarlyPaymentFields = () => {
        this.setState((prevState) => ({
            showEarlyPaymentFields: !prevState.showEarlyPaymentFields,
        }));
    };

    QGetTextFromFieldFee = (e) => {
        this.setState((prevState) => ({
            fee: { ...prevState.fee, [e.target.name]: e.target.value }
        }));
    };



    renderPartialPaymentFields = () => {
        const { showPartialPaymentFields} = this.state;

        if (showPartialPaymentFields) {
            return (
                
                <div>
                    <div className="form-floating">
                        <span className="spanInput">&euro;</span>
                        <input
                            onChange={(e) => this.QGetTextFromFieldFee(e)}
                            type="number"
                            className="form-control"
                            id="floatingPartialPayment"
                            placeholder=""
                            name="fee"
                            style={{ paddingLeft: '25px' }}
                            min={1}
                        />
                        <label>Fee</label>
                    </div>

                    <div style={{ display: "flex", flexDirection: "row" }}>

                        {this.state.formData.map((data, index) => (
                            <div key={index} style={{ display: "flex", flexDirection: "column" }} >
                                <div className="form-floating" style={{marginLeft: "1%"} }>
                                    <input
                                        onChange={(e) => this.handleInputChange(e, index)}
                                        type="number"
                                        className="form-control"
                                        id={`floatingPartialPayment${index}`}
                                        placeholder=""
                                        name="key"
                                        style={{ paddingLeft: '25px' }}
                                        min={1}
                                        value={data.key}
                                    />
                                    <label>Number of payment </label>
                                </div>

                                <div className="form-floating">
                                    <span className="spanInput">&euro;</span>
                                    <input
                                        onChange={(e) => this.handleInputChange(e, index)}
                                        type="number"
                                        className="form-control"
                                        id={`floatingPartialPayment${index}`}
                                        placeholder=""
                                        name="value"
                                        style={{ paddingLeft: '25px' }}
                                        min={1}
                                        value={data.value}
                                    />
                                    <label>Amount</label>
                                </div>

                            </div>
                        ))}
                    </div>



                </div >


            );
        }
    };

    renderEarlyPaymentFields = () => {
        const { showEarlyPaymentFields } = this.state;

        if (showEarlyPaymentFields) {
            return (

                <div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>

                        {this.state.formDataEarly.map((data, index) => (
                            <div key={index} style={{ display: "flex", flexDirection: "column" }}>
                                <div style={{marginLeft: "1%", width: "100%"}} className="form-floating">
                                    <input
                                        onChange={(e) => this.handleInputChangeEarly(e, index)}
                                        type="number"
                                        className="form-control"
                                        id={`floatingPartialPayment${index}`}
                                        placeholder=""
                                        name="key"
                                        style={{ paddingLeft: '25px' }}
                                        min={1}
                                        value={data.key}
                                    />
                                    <label>Number of payment </label>
                                </div>

                                <div style={{ marginRight: "1%", width: "100%" }}  className="form-floating">
                                    <span className="spanInput">&euro;</span>
                                    <input
                                        onChange={(e) => this.handleInputChangeEarly(e, index)}
                                        type="number"
                                        className="form-control"
                                        id={`floatingPartialPayment${index}`}
                                        placeholder=""
                                        name="value"
                                        style={{ paddingLeft: '25px' }}
                                        min={1}
                                        value={data.value}
                                    />
                                    <label>Amount</label>
                                </div>

                            </div>
                        ))}
                    </div>

                </div >


            );
        }
    };

    QGetTextFromField = (e) => {
        this.setState((prevState) => ({
            calculation: { ...prevState.calculation, [e.target.name]: e.target.value }
        }));
    };

    validateInput = () => {
        const { amount, period, start, rate } = this.state.calculation;
        const { formData, formDataEarly, fee } = this.state;
        const errorMessages = {};
        //const edit = 0;



        if ((!amount || amount.trim().length === 0) &&
            (!period || period.trim().length === 0) &&
            (!rate || rate.trim().length === 0)
        ) {
            console.log("UBCIUS E")
            this.setState({ edit: 1 });


        }
        else if (
            (!amount || amount.trim().length === 0) ||
            (!period || period.trim().length === 0) ||
            (!start || start.trim().length === 0) ||
            (!rate || rate.trim().length === 0)
        ) {
            console.log("UBCIUS E2222222222222222222222222")

            errorMessages.error = 'All fields are required.';

        }

        console.log(amount + "amount")
        console.log(period + "period")
        console.log(rate + "rate")




        // Check if any of the early payment fields are filled
        const isEarlyPaymentFilled = formDataEarly.every(
            (data) => !!data.key && data.key.trim().length > 0 && !!data.value && data.value.trim().length > 0
        );

        if (!isEarlyPaymentFilled) {
            this.setState({ formDataEarly: [] });
        }

        // Check if any of the partial payment fields are filled
        const isPartialPaymentFilled = formData.every(
            (data) => !!data.key && data.key.trim().length > 0 && !!data.value && data.value.trim().length > 0
        );

        if (!isPartialPaymentFilled) {
            this.setState({ formData: [] });
        }

        // Check if the fee field is filled
        //const isFeeFilled = !!fee.fee && fee.fee.trim().length > 0;

        this.setState({ errorMessages });
        //this.setState({edit})

        // Return true if all fields are valid, otherwise return false
        return !Object.values(errorMessages).some((message) => message);
    };

QPostField = () => {

    console.log(this.props.editSchedule)
    const edited = this.props.editSchedule;
    console.log(edited)

    const isValid = this.validateInput();

    console.log(isValid);

    if (!isValid) {
        return;
    }
    const { edit } = this.state;

    let editedInput = {
        request_Id: 0,
        request_Name: "string",
        loan_Amount: 0,
        loan_Period: 0,
        interest_Rate: 0,
        loan_Start_Date: "2023-08-04T09:51:01.848Z",
        last_Version: true,
        date_Issued: "2023-08-04T09:51:01.848Z",
        issuer: "string",
        approval_Cost: 0,
        insurance_Cost: 0,
        account_Cost: 0,
        other_Costs: 0,
        monthly_Payment: 0,
        total_Interest_Paid: 0,
        total_Other_Costs: 0,
        total_Loan_Cost: 0,
        loan_Payoff_Date: "2023-08-04T09:51:01.848Z",
        r_User_Id: 0
    };
    console.log(this.state.edit+" this edit")
    if (edit === 0) {
        editedInput = {
            request_Id: 0,
            request_Name: edited.request_Name,
            loan_Amount: this.state.calculation.amount,
            loan_Period: this.state.calculation.period,
            interest_Rate: this.state.calculation.rate,
            loan_Start_Date: this.state.calculation.start,
            approval_Cost: this.state.calculation.approval,
            insurance_Cost: this.state.calculation.insurance,
            account_Cost: this.state.calculation.account,
            other_Costs: this.state.calculation.costs,
            monthly_Payment: 0,
            last_version: true,
            issuer: "",
            date_issued: "2023-07-19T07:22:56.004Z",
            total_Interest_Paid: 0,
            total_Loan_Cost: 0,
            loan_Payoff_Date: "2023-07-19T07:22:56.004Z",
            r_User_Id: 0
        }
    }

    this.setState({ currentReqId: edited.request_Id + "" })
    console.log("lalalalala" + edited.request_Id + "")

    axios.post('https://localhost:7224/CalculateAmortizationPlan/edit', editedInput,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            params: {
                reqId: edited.request_Id + ""
            }
        })
        .then(response => {
            console.log(response.data.summary)
            console.log("Sent to server...")

            const parameterDataEarly = {};
            if (this.state.formDataEarly !== 0) {
                this.state.formDataEarly.forEach((item) => {
                    parameterDataEarly[item.key] = parseFloat(item.value);
                });
            }
            console.log(parameterDataEarly)
            console.log("first" + response.data.summary.request_Id)
            axios.post('https://localhost:7224/CalculateAmortizationPlan/applyearly', parameterDataEarly, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: {
                    reqName: response.data.summary.request_Id
                }
            }).then(sndRes => {
                console.log(sndRes.data);
                console.log("snd" + sndRes.data.summary.request_Id)

                const parameterData = {};
                if (this.state.formData !== {}) {
                    this.state.formData.forEach((item) => {
                        parameterData[item.key] = parseFloat(item.value);
                    });
                }
                console.log(parameterData)
                let inputFee = 0
                if (this.state.fee.fee !== "") {
                    inputFee = parseFloat(this.state.fee.fee)
                    }
                //if fee not empty 

                axios.post('https://localhost:7224/CalculateAmortizationPlan/applypartial', parameterData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    params: {
                        reqName: sndRes.data.summary.request_Id,
                        fee: inputFee
                    }
                }).then(rdRes => {
                    console.log(rdRes.data)
                    console.log("trd" + rdRes.data.summary.request_Id)

                    console.log("Sent to server...")
                    this.props.QIDFromChild({
                        page: "editcalculation", editSum: rdRes.data.summary, editSchedules: rdRes.data.schedules
                    })
                }).catch(err => {
                    console.log(err)
                    console.log(err.response.data);
                    alert(err.response.data.detail)
                })

            }).catch(err => {
                console.log(err)
                console.log(err.response.data);
                alert(err.response.data.detail)

            })

        }).catch(err => {
            console.log(err)
            console.log(err.response.data);
            alert(err.response.data.detail)

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
        const { errorMessages } = this.state;
        const name = localStorage.getItem('name');
        const surname = localStorage.getItem('surname');
        const edited = this.props.editSchedule;
        const { showPartialPaymentFields } = this.state;
        const { showEarlyPaymentFields } = this.state;

        console.log(typeof(this.state.fee.fee))

        console.log(edited.loan_Amount)
        
        console.log(this.state.formData);
        console.log(this.state.formDataEarly);
        return (
            <div>

                <div className="container">
                    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-3 border-bottom">
                        <div>
                            <button className="uniButton" onClick={() => this.QSetViewInParent({ page: "history" })}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                </svg>
                            </button>
                        </div>
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

                <h4>Edit Schedule</h4>
                <div className="centerDiv">
                    <div id="formH">


                        <div className="form-floating">
                            <input onChange={(e) => this.QGetTextFromField(e)} type="text" className="form-control" id="floatingInput" placeholder="" name="nameFor" style={{ paddingLeft: '25px' }} value={edited.request_Name }></input>

                            <label>Request name</label>

                        </div>

                        <div className="form-floating">
                            <span className="spanInput">
                                &euro;
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
                                &euro;
                            </span>
                            <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingApproval" placeholder="" name="approval" style={{ paddingLeft: '25px' }} min={1}></input>
                            <label>Approval</label>
                        </div>

                        <div className="form-floating">
                            <span className="spanInput">
                                &euro;
                            </span>
                            <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingInsurance" placeholder="" name="insurance" style={{ paddingLeft: '25px' }} min={1}></input>
                            <label>Insurance</label>
                        </div>

                        <div className="form-floating">
                            <span className="spanInput">
                                &euro;
                            </span>
                            <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingAccount" placeholder="" name="account" style={{ paddingLeft: '25px' }} min={1}></input>
                            <label>Account</label>
                        </div>

                        <div className="form-floating">
                            <span className="spanInput">
                                &euro;
                            </span>
                            <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingCosts" placeholder="" name="costs" style={{ paddingLeft: '25px' }} min={1}></input>
                            <label>Other costs</label>
                        </div>

                        {errorMessages.error && <div style={{ color: 'red' }}>{errorMessages.error}</div>}

                        <br></br>

                        <div >
                            <button onClick={this.toggleEarlyPaymentFields} className="btn btn-outline-primary">
                                {showEarlyPaymentFields ? 'Hide' : 'Early Payments'}
                            </button>
                        </div>
                        {this.renderEarlyPaymentFields()}

                        <br></br>

                        <div >
                            <button onClick={this.togglePartialPaymentFields} className="btn btn-outline-primary">
                                     {showPartialPaymentFields ? 'Hide' : 'Partial Payments'}
                             </button>
                         </div>
                        {this.renderPartialPaymentFields()}
                        <br></br>



                    <button onClick={() => this.QPostField()} className="buttona" type="button">Calculate</button>
                </div>
                </div>

            </div>
          );
        

    }

}


export default EditSchedule;