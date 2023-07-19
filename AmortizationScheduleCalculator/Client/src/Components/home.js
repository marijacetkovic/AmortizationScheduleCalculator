import React from "react";
import './style.css';
import axios from "axios";

class Home extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
     calculation: {},
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

  QSetView = (obj) => {
    this.setState({
      CurrentPage: obj.page
    });
  };

  QSetViewInParent=(obj)=>{
    this.props.QIDFromChild(obj);
  };

  QPostField = () => {
    axios.post('/https://localhost:7224/CalculateAmortizationPlan',{
      request_Name:this.state.calculation.nameFor,
      loan_Amount:this.state.calculation.amount,
      loan_Period:this.state.calculation.period,
      loan_Start_Date:this.state.calculation.start,
      interest_Rate:this.state.calculation.rate,
      approval_Cost:this.state.calculation.approval,
      insurance_Cost:this.state.calculation.insurance,
      account_Cost:this.state.calculation.account,
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

    //we nee to redired to new component
    this.props.QIDFromChild({page: "calculation"})
  };

  
  render() {
    const { selectedDate, timestamp } = this.state;
    return (
    <div>

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
          <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingPassword" placeholder="" name="period" style={{ paddingLeft: '25px' }} min={1} ></input>
          <label>Loan period</label>
        </div>

        <div className="form-floating">
          <input onChange={(e) => {this.QGetTextFromField(e);this.handleDateChange(e)}} type="date" value={selectedDate} className="form-control" id="floatingDate" placeholder="dd/mm/yyyy" name="start" style={{ paddingLeft: '25px' }}></input>
          <label>Loan start</label>
        </div>

        <div className="form-floating">
            <span className="spanInput">
                %
            </span>
          <input  onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingRate" placeholder="" name="rate" style={{ paddingLeft: '25px' }} min={1}></input>
          <label>Interest rate</label>
        </div>

        <div className="form-floating">
        <span className="spanInput"
          >
            €
            </span>
          <input  onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingApproval" placeholder="" name="approval" style={{ paddingLeft: '25px' }} min={1}></input>
          <label>Approval</label>
        </div>

        <div className="form-floating">
        <span className="spanInput"
          >
            €
            </span>
          <input  onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingInsurance" placeholder="" name="insurance" style={{ paddingLeft: '25px' }} min={1}></input>
          <label>Insurance</label>
        </div>

        <div className="form-floating">
          <span className="spanInput">
            €
            </span>
          <input  onChange={(e) => this.QGetTextFromField(e)} type="number" pattern="^[0-9]*$" className="form-control" id="floatingAccount" placeholder="" name="account" style={{ paddingLeft: '25px' }} min={1}></input>
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
        
        <button onClick = {() => this.QPostField()} className="buttona" >Calculate</button>
        
    </form>
    </div>

    </div>
      );
    }
}


export default Home;