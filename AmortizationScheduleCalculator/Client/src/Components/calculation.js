import React from 'react';
import axios from "axios";
import "./style.css";
import  { MDBTable, MDBTableHead, MDBTableBody }  from 'mdb-react-ui-kit';


class Calculation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            calculation: []
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

    componentDidMount() {

         const token = localStorage.getItem('token');
         
            axios.get('https://localhost:7224/CalculateAmortizationPlan', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                     //console.log(this.props.token)
                     console.log(response.data)
                     this.setState({
                         calculation: response.data
                     })
                 })
    };

    formatDate = (dateString) => {
        const dateObject = new Date(dateString);
        const options = { year: 'numeric', month: 'short' };
        return dateObject.toLocaleDateString(undefined, options);
    };

        
    render(){
        let data = this.state.calculation;
        let lastElement = data.length > 0 ? data[data.length - 1] : null;
        const name = localStorage.getItem('name');
        const surname = localStorage.getItem('surname');
        const obj = localStorage.getItem('token');

                return (
                    <div>
                       <div className="container">
                          <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-3 border-bottom">
                                <div className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                                    </svg>
                                    <div>{name} {" "} {surname}</div>

                                </div>

                                <div style={{ textAlign: "center" }} id="title">Amortization Calculator </div>

                                <div className="col-md-3 text-end">
                                    <button type="button" onClick={() => this.QSetViewInParent({ page: "history" })} className="btn btn-outline me-2">History</button>
                                    <button type="button" onClick={() => this.QSetViewInParent({ page: "login" })} className="btn">Logout</button>
                                </div>
                         </header>
                      </div> 

                       {lastElement ?
                          <div>
                            
                               <div style={{overflowX: "auto"}}>
                                   <div style={{width: "60%", margin: "auto", marginTop: "8%"}}>
                                         <div className="col" style={{ margin: "auto", marginTop: "5%" }}>
                                   <div className="card" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"}}>
                                         <div className="card-body">
                                       <div style={{ display: "flex", justifyContent: "space-between"}}>
                                             <p style={{ marginLeft: "1px", fontWeight: "bolder", fontSize: "20px" }} className="card-text">SUMMARY</p>
                                                        <a onClick={() => this.QSetViewInParent({ page: "Schedule" })} style={{ marginRight: "1px", fontWeight: "bolder", fontSize: "20px" }} className="card-text"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                                                        </svg></a>
                                       </div>
                                   <hr></hr>
                                   <MDBTable borderless  responsive style={{minWidth: "200px", margin:"auto"}}>
                                         <MDBTableHead>
                                             <tr>
                                                  <th className="thElement" scope='col'>Request name</th>
                                                  <th className="thElement"  scope='col'>Monthly payment</th>
                                                  <th className="thElement"  scope='col'>Total interest paid</th>
                                                  <th className="thElement"  scope='col'>Total cost of loan</th>
                                                  <th className="thElement"  scope='col'>Payoff date</th>
                                             </tr>
                                                  </MDBTableHead>
                                                  <MDBTableBody>
                                             <tr>
                                                   <td className="tdElement">{lastElement.request_Name}</td>      
                                                   <td className="tdElement">{lastElement.monthly_Payment}&euro;</td>
                                                   <td className="tdElement">{lastElement.total_Interest_Paid}&euro; </td>
                                                   <td className="tdElement">{lastElement.total_Loan_Cost}&euro;</td>
                                                   <td className="tdElement">{this.formatDate(lastElement.loan_Payoff_Date)}</td>
                                             </tr>
                                                
                                                  </MDBTableBody>
                                                  </MDBTable>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                     </div>
                : "Loading.."}
             </div>
         );
    }
 }

export default Calculation;