import React from "react";
import './style.css';
import axios from "axios";

class Profile extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
        calculation: {
        },
     selectedDate: '',
      timestamp: '',
    };
   this.handleDateChange = this.handleDateChange.bind(this);
  };

  
  handleDateChange = (event) => {
    const selectedDate = event.target.value;
    this.setState({ selectedDate });

    // Convert the selected date to a timestamp
    const dateObject = new Date(selectedDate);
    const timestampInSeconds = Math.floor(dateObject.getTime() / 1000);
    this.setState({ timestamp: timestampInSeconds });
  };

  QGetTextFromField = (e) => {
    this.setState((prevState) => ({
      calculation: { ...prevState.calculation, [e.target.name]: e.target.value }
    }));
  };

  //put the fields
  QPostField=()=>{
      axios.post('https://localhost:7224/CalculateAmortizationPlan', {
      request_Id:0,
      request_Name:this.state.calculation.nameFor,
      loan_Amount:this.state.calculation.amount,
      loan_Period:this.state.calculation.period,
      interest_Rate: this.state.calculation.rate,
      loan_Start_Date: this.state.calculation.date,
      approval_Cost:this.state.calculation.approval,
      insurance_Cost:this.state.calculation.insurance,
      account_Costs:this.state.calculation.account,
      other_Costs:this.state.calculation.costs,
      monthly_Payment: 0,
      total_Interest_Paid: 0,
      total_Loan_Cost: 0,
      loan_Payoff_Date: "2023-07-19T07:22:56.004Z",
      r_User_Id: 0
    })
    .then(response=>{
        console.log("Sent to server...")
       
    })
    .catch(err=>{
      console.log(err)
    })
    this.props.QIDFromChild({page: "profile"})
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
    return (
      <div>

          <div className="container">
                  <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-3 border-bottom">
                    <a href="#" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                      <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
                    </a>

                    <div id="title">Amortization Calculator </div>


                   <div className="col-md-3 text-end">
                  <button type="button" onClick={() => this.QSetViewInParent({ page: "profile" })} className="btn btn-outline me-2">New calculation</button>
                  <button type="button" onClick={() => this.QSetViewInParent({ page: "login" })} className="btn">Logout</button>
               </div>
                  </header>
              </div> 

        <div className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary" style={{width: "15%", height: "100%"}}>
          
          {/*<hr></hr>*/}
          {/*<ul className="nav nav-pills flex-column mb-auto">
            
            <li>
              <button className="nav-link link-body-emphasis"  onClick={() => this.QSetViewInParent({ page: "Schedule" })}>
                <svg className="bi pe-none me-2" width="16" height="16"></svg>
                Schedule
              </button>
            </li>
            </ul>
    <hr></hr>*/}

        {/*} <div className="dropdown" >
            <a href="#" className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
           <i class="bi bi-person"></i>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
            </svg>
              <strong>User</strong>
            </a>
            <ul className="dropdown-menu text-small shadow">
              <li><a className="dropdown-item" href="#">New calculation</a></li>
              <li><a className="dropdown-item" href="#" onClick={() => this.QSetViewInParent({ page: "home" })}>Sign out</a></li>
            </ul>
    </div>*/}
        
          </div>

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
              <input  onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingInput" placeholder="" name="amount" style={{ paddingLeft: '25px' }} min={1}></input>
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
              <input  onChange={(e) => {this.QGetTextFromField(e)}} type="date" className="form-control" id="floatingDate" placeholder="" name="start" style={{ paddingLeft: '25px' }}></input>
              <label>Loan start</label>
            </div>

            <div className="form-floating">
            <span className="spanInput"
              >
                %
              </span>
              <input  onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingRate" placeholder="" name="rate" style={{ paddingLeft: '25px' }} min={1}></input>
              <label>Interest rate</label>
            </div>

            <div className="form-floating">
            <span className="spanInput">
                €
              </span>
              <input  onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingApproval" placeholder="" name="approval" style={{ paddingLeft: '25px' }} min={1}></input>
              <label>Approval</label>
            </div>

            <div className="form-floating">
            <span className="spanInput">
                €
              </span>      
              <input  onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingInsurance" placeholder="" name="insurance" style={{ paddingLeft: '25px' }} min={1}></input>
              <label>Insurance</label>
            </div>

            <div className="form-floating">
            <span className="spanInput">
                €
              </span>
              <input  onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingAccount" placeholder="" name="account" style={{ paddingLeft: '25px' }} min={1}></input>
              <label>Account</label>
            </div>

            <div className="form-floating">
            <span className="spanInput">
                €
              </span>
              <input  onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingCosts" placeholder="" name="costs" style={{ paddingLeft: '25px' }} min={1}></input>
              <label>Other costs</label>
            </div>

              <br></br>
            
              <button onClick= {() => this.QPostField()} className="buttona" type="button">Calculate</button>
            
        </form>
        </div>

  </div>
    );
  }
}


export default Profile;