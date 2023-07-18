import React from "react";
import './style.css';
import axios from "axios";

class Profile extends React.Component {

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
  <div className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary" style={{width: "15%", height: "100%"}}>
    
    <hr></hr>
    <ul className="nav nav-pills flex-column mb-auto">
      
      <li>
        <button className="nav-link link-body-emphasis"  onClick={() => this.QSetViewInParent({ page: "Schedule" })}>
          <svg className="bi pe-none me-2" width="16" height="16"></svg>
          Schedule
        </button>
      </li>
     
      </ul>

    
    <hr></hr>

    
    <div className="dropdown" >
      <a href="#" className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      {/*<i class="bi bi-person"></i>*/}
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
</svg>
        <strong>User</strong>
      </a>
      <ul className="dropdown-menu text-small shadow">
        <li><a className="dropdown-item" href="#">New calculation</a></li>
        <li><a className="dropdown-item" href="#" onClick={() => this.QSetViewInParent({ page: "home" })}>Sign out</a></li>
      </ul>
    </div>
  
    </div>

    <div style={{marginTop: "-7%", textAlign: "center",display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'}}>
    <form style={{width: "35%", }}>

    <div className="form-floating">
    <span
        style={{
          position: 'absolute',
          left: '10px', // Adjust the left positioning as needed
          top: '64%',
          transform: 'translateY(-50%)',
        }}
      >
        €
      </span>
      <input  onChange={(e) => this.QGetTextFromField(e)} type="email" className="form-control" id="floatingInput" placeholder="" name="amount" style={{ paddingLeft: '25px' }}></input>
      <label>Loan amount</label>
    </div>
    <div className="form-floating">
      <input onChange={(e) => this.QGetTextFromField(e)} type="password" className="form-control" id="floatingPassword" placeholder="" name="period" style={{ paddingLeft: '25px' }}></input>
      <label>Loan period</label>
    </div>

    <div className="form-floating">
      <input  onChange={(e) => this.QGetTextFromField(e)} type="date" className="form-control" id="floatingDate" placeholder="" name="start" style={{ paddingLeft: '25px' }}></input>
      <label>Loan start</label>
    </div>

    <div className="form-floating">
    <span
        style={{
          position: 'absolute',
          left: '10px', // Adjust the left positioning as needed
          top: '64%',
          transform: 'translateY(-50%)',
        }}
      >
        %
      </span>
      <input  onChange={(e) => this.QGetTextFromField(e)} type="text" className="form-control" id="floatingRate" placeholder="" name="rate" style={{ paddingLeft: '25px' }}></input>
      <label>Interest rate</label>
    </div>

    <div className="form-floating">
    <span
        style={{
          position: 'absolute',
          left: '10px', // Adjust the left positioning as needed
          top: '64%',
          transform: 'translateY(-50%)',
        }}
      >
        €
      </span>
      <input  onChange={(e) => this.QGetTextFromField(e)} type="text" className="form-control" id="floatingApproval" placeholder="" name="approval" style={{ paddingLeft: '25px' }}></input>
      <label>Approval</label>
    </div>

    <div className="form-floating">
    <span
        style={{
          position: 'absolute',
          left: '10px', // Adjust the left positioning as needed
          top: '64%',
          transform: 'translateY(-50%)',
        }}
      >
        €
      </span>      
      <input  onChange={(e) => this.QGetTextFromField(e)} type="text" className="form-control" id="floatingInsurance" placeholder="" name="insurance" style={{ paddingLeft: '25px' }}></input>
      <label>Insurance</label>
    </div>

    <div className="form-floating">
    <span
        style={{
          position: 'absolute',
          left: '10px', // Adjust the left positioning as needed
          top: '64%',
          transform: 'translateY(-50%)',
        }}
      >
        €
      </span>
      <input  onChange={(e) => this.QGetTextFromField(e)} type="text" className="form-control" id="floatingAccount" placeholder="" name="account" style={{ paddingLeft: '25px' }}></input>
      <label>Account</label>
    </div>

    <div className="form-floating">
    <span
        style={{
          position: 'absolute',
          left: '10px', // Adjust the left positioning as needed
          top: '64%',
          transform: 'translateY(-50%)',
        }}
      >
        €
      </span>
      <input  onChange={(e) => this.QGetTextFromField(e)} type="text" className="form-control" id="floatingCosts" placeholder="" name="costs" style={{ paddingLeft: '25px' }}></input>
      <label>Other costs</label>
    </div>

      <br></br>
    
      <button onClick= {() => this.QSetViewInParent({page: "calculation"})} className="buttona" type="submit">Calculate</button>
    
  </form>
  </div>

  </div>
    );
  }
}


export default Profile;