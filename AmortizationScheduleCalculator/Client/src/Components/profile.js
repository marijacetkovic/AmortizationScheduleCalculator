import React from "react";
import './style.css';
import axios from "axios";

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
     calculation: {}
    };
  }
  QGetTextFromField = (e) => {
    this.setState((prevState) => ({
      calculation: { ...prevState.calculation, [e.target.name]: e.target.value }
    }));
  };

  //put the fields
  QPostField=()=>{
    axios.post('/calculator',{
      amount:this.state.calculation.amount,
      period:this.state.calculation.period,
      start:this.state.calculation.start,
      rate:this.state.calculation.rate,
      approval:this.state.calculation.approval,
      insurance:this.state.calculation.insurance,
      account:this.state.calculation.account,
      costs:this.state.calculation.costs,
    })
    .then(response=>{
      console.log("Sent to server...")
    })
    .catch(err=>{
      console.log(err)
    })
    this.props.QIDFromChild({page: "profile"})
  }

  
  render() {
    return (
      <div>
      <div className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary" style={{width: "15%", height: "100%"}}>
    <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
      <svg className="bi pe-none me-2" width="40" height="32"></svg>
      <span className="fs-4">Profile</span>
    </a>
    <hr></hr>
    <ul className="nav nav-pills flex-column mb-auto">
      
      <li>
        <a href="#" className="nav-link link-body-emphasis">
          <svg className="bi pe-none me-2" width="16" height="16"></svg>
          Schedule
        </a>
      </li>
     
    </ul>
    <hr></hr>
    <div className="dropdown">
      <a href="#" className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        
        <strong>user</strong>
      </a>
      <ul className="dropdown-menu text-small shadow">
        <li><a className="dropdown-item" href="#">New project...</a></li>
        <li><a className="dropdown-item" href="#">Settings</a></li>
        <li><a className="dropdown-item" href="#">Profile</a></li>
        <li><hr className="dropdown-divider"></hr></li>
        <li><a className="dropdown-item" href="#">Sign out</a></li>
      </ul>
    </div>
    </div>

    <div style={{marginTop: "-10%", textAlign: "center",display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'}}>
    <form style={{width: "35%", }}>
    <h1 className="h3 mb-3 fw-normal">Calculator</h1>

    <div className="form-floating">
      <input  onChange={(e) => this.QGetTextFromField(e)} type="email" className="form-control" id="floatingInput" placeholder="" name="amount"></input>
      <label  >Loan amount</label>
    </div>
    <div className="form-floating">
      <input  onChange={(e) => this.QGetTextFromField(e)} type="password" className="form-control" id="floatingPassword" placeholder="" name="period"></input>
      <label >Loan period</label>
    </div>

    <div className="form-floating">
      <input  onChange={(e) => this.QGetTextFromField(e)} type="date" className="form-control" id="floatingDate" placeholder="" name="start"></input>
      <label>Loan start</label>
    </div>

    <div className="form-floating">
      <input  onChange={(e) => this.QGetTextFromField(e)} type="text" className="form-control" id="floatingRate" placeholder="" name="rate"></input>
      <label>Interest rate</label>
    </div>

    <div className="form-floating">
      <input  onChange={(e) => this.QGetTextFromField(e)} type="text" className="form-control" id="floatingApproval" placeholder="" name="approval"></input>
      <label >Approval</label>
    </div>

    <div className="form-floating">
      <input  onChange={(e) => this.QGetTextFromField(e)} type="text" className="form-control" id="floatingInsurance" placeholder="" name="insurance"></input>
      <label >Insurance</label>
    </div>

    <div className="form-floating">
      <input  onChange={(e) => this.QGetTextFromField(e)} type="text" className="form-control" id="floatingAccount" placeholder="" name="account"></input>
      <label >Account</label>
    </div>

    <div className="form-floating">
      <input  onChange={(e) => this.QGetTextFromField(e)} type="text" className="form-control" id="floatingCosts" placeholder="" name="costs"></input>
      <label>Other costs</label>
    </div>

      <br></br>
    
    <button className="btn btn-primary w-100 py-2" type="submit">Calculate</button>
    
  </form>
  </div>

  </div>
    );
  }
}


export default Home;