import React from "react";
import './style.css';
import axios from "axios";

class Home extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
     calculation: {}
    };
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

    //we nee to redired to new component
    this.props.QIDFromChild({page: "profile"})
  };

  
  render() {
  return (
    
  <div>

    <div style={{ textAlign: "center",display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'}}>
    <form style={{width: "30%", marginTop: "2%"}}>

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
      <input onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingInput" placeholder="" name="amount" style={{ paddingLeft: '25px' }} ></input>
      
      <label>Loan amount</label>
    </div>
    <div className="form-floating">
      <input  onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingPassword" placeholder="" name="period" style={{ paddingLeft: '25px' }} ></input>
      <label >Loan period</label>
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
      <input  onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingRate" placeholder="" name="rate" style={{ paddingLeft: '25px' }}></input>
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
      <input  onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingApproval" placeholder="" name="approval" style={{ paddingLeft: '25px' }}></input>
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
      <input  onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingInsurance" placeholder="" name="insurance" style={{ paddingLeft: '25px' }}></input>
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
      <input  onChange={(e) => this.QGetTextFromField(e)} type="number" pattern="^[0-9]*$" className="form-control" id="floatingAccount" placeholder="" name="account" style={{ paddingLeft: '25px' }}></input>
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
      <input  onChange={(e) => this.QGetTextFromField(e)} type="number" className="form-control" id="floatingCosts" placeholder="" name="costs" style={{ paddingLeft: '25px' }}></input>
      <label>Other costs</label>
    </div>

      <br></br>
    
    <button onClick = {(e) => this.QSetViewInParent({page: "calculation"})} className="buttona" >Calculate</button>
    
  </form>
  </div>

  </div>
    );
  }
}


export default Home;