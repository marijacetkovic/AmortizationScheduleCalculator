import React from 'react';
import axios from "axios";

class Calculation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        
      };

      QSetViewInParent = (obj) => {
        this.props.QIDFromChild(obj);
     };

     QSetView = (obj) => {
        this.setState({
          CurrentPage: obj.page
        });
      };

    render(){
        return (
            <div>
                 <div className="row row-cols-1 row-cols-md-3 g-4">
                    <div className="col" style={{ margin: "auto", marginTop: "5%" }}>
                    <div className="card">
                        <div className="card-body">
                        <p style={{textAlign:"left", fontWeight:"bolder", fontSize: "20px"}} className="card-text">Summary</p>
                        <hr></hr>
                        <div style={{ fontWeight: "bold" }} className="card-text">
                            <div style={{display: "flex", justifyContent: "space-between"}} className="payment-summary">
                                <div className="monthly-payment">Monthly Payment</div>
                                <div className="total-interest">Total Interest Paid</div>
                                <div className="total-cost">Total Cost of Loan</div>
                            </div>
                        </div>
                        <p className="card-text">
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            );

    }
}

export default Calculation;