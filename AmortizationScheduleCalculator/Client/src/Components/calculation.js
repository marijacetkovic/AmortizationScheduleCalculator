import React, { PureComponent } from 'react';
import axios from "axios";
import "./style.css";
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';




class Calculation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            calculation: {},
            schedule: [],
            useCanvas: false
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

    formatDate = (dateString) => {
        const dateObject = new Date(dateString);
        const options = { year: 'numeric', month: 'short' };
        return dateObject.toLocaleDateString(undefined, options);
    };

    getGraphData = (data) => {
        var graphData=[];
        var interest = 0;
        var principal = 0;
        for (var i = 0; i < data.length; i++) {
            interest += data[i].interest_Paid;
            principal += data[i].principal_Paid;
            graphData[i] = {
                Interest:interest,
                Principal:principal,
                Balance: data[i].remaining_Loan,
                Date: data[i].current_Date
            }
        }
        return graphData;
    }


    render() {
        const summaryData = this.props.data;
        const schedulesData = this.props.schedule;
        console.log(schedulesData);
        //let summary = summaryData.sum;
        //let lastElement = data.length > 0 ? data[data.length - 1] : null;
        const name = localStorage.getItem('name');
        const surname = localStorage.getItem('surname');

        return (
            <div style={{
                display: "flex",

                flexDirection: "column",

                alignItems: "center",

                justifyContent: "center"
            }}>
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

                {summaryData  ?
                    <div>

                        <div style={{ overflowX: "auto" }}>
                            <div style={{ marginTop: "1%" }}>
                                <div className="col" style={{ margin: "auto", marginTop: "5%" }}>
                                    <div className="card" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                                        <div className="card-body">
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <p style={{ marginLeft: "1px", fontWeight: "bolder", fontSize: "20px" }} className="card-text">SUMMARY</p>
                                                
                                            </div>
                                            <hr></hr>
                                            <MDBTable borderless responsive style={{ minWidth: "200px", margin: "auto" }}>
                                                <MDBTableHead>
                                                    <tr>
                                                        <th className="thElement" scope='col'>Request name</th>
                                                        <th className="thElement" scope='col'>Monthly payment</th>
                                                        <th className="thElement" scope='col'>Total interest paid</th>
                                                        <th className="thElement" scope='col'>Total cost of loan</th>
                                                        <th className="thElement" scope='col'>Payoff date</th>
                                                    </tr>
                                                </MDBTableHead>
                                                <MDBTableBody>
                                                    <tr>
                                                        <td className="tdElement">{summaryData.request_Name}</td>
                                                        <td className="tdElement">{summaryData.monthly_Payment}&euro;</td>
                                                        <td className="tdElement">{summaryData.total_Interest_Paid}&euro; </td>
                                                        <td className="tdElement">{summaryData.total_Loan_Cost}&euro;</td>
                                                        <td className="tdElement">{this.formatDate(summaryData.loan_Payoff_Date)}</td>
                                                    </tr>

                                                </MDBTableBody>
                                            </MDBTable>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <LineChart 
                                width={800}
                                height={400}
                                data={this.getGraphData(schedulesData)}
                                margin={{
                                    top: 20,
                                    right: 10,
                                    left: 10,
                                    bottom: 5,
                                }} textAlign={"center"}

                            >
                                <CartesianGrid />
                                
                                <XAxis dataKey="Date" />
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Line type="monotone" dataKey="Principal" stroke="#8884d8" />
                                <Line type="monotone" dataKey="Interest" stroke="#d990d8"  />
                                <Line type="monotone" dataKey="Balance" stroke="#82ca9d" />
                                </LineChart>

                        </div>


                        <div>

                            <MDBTable striped hover style={{ maxWidth: "1150px", margin: "auto", marginTop: "60px" }}>
                                <MDBTableHead >
                                    <tr>
                                        <th style={{ backgroundColor: "#526D82", color:"#DDE6ED" }} scope='col'>Date</th>
                                        <th style={{ backgroundColor: "#526D82", color: "#DDE6ED" }} scope='col'>Monthly payment</th>
                                        <th style={{ backgroundColor: "#526D82", color: "#DDE6ED" }} scope='col'>Principal</th>
                                        <th style={{ backgroundColor: "#526D82", color: "#DDE6ED" }} scope='col'>Interest</th>
                                        <th style={{ backgroundColor: "#526D82", color: "#DDE6ED" }} scope='col'>Remaining balance</th>
                                    </tr>
                                </MDBTableHead>

                                {schedulesData.length > 0 ?
                                    schedulesData.map((d) => {
                                        return (
                                            <MDBTableBody>
                                                <tr>
                                                    <td className="scheduleTd">{this.formatDate(d.current_Date)}</td>
                                                    <td>{d.monthly_Paid}&euro;</td>
                                                    <td>{d.principal_Paid}&euro;</td>
                                                    <td>{d.interest_Paid}&euro;</td>
                                                    <td>{d.remaining_Loan}&euro;</td>
                                                </tr>
                                            </MDBTableBody>

                                        )
                                    })
                                    : "Loading.."}
                            </MDBTable>

                        </div>

                    </div>
                    : "Loading.."}

               

                
            </div>
        );
    }
}

export default Calculation;