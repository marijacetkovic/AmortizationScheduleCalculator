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
            editable: false,
            inputValue: '',
            disabled: true,
            placeholder1: ""
        };

    };

    handleClik() {
        this.setState({ disabled: !this.state.disabled , placeholder1: ""})
    } 

    handleP() {
        this.setState({ placeholder1: this.props.amount })
    }

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
        var graphData = [];
        var interest = 0;
        var principal = 0;
        for (var i = 0; i < data.length; i++) {
            interest += data[i].interest_Paid;
            principal += data[i].principal_Paid;
            graphData[i] = {
                Interest: interest,
                Principal: principal,
                Balance: data[i].remaining_Loan,
                Date: this.formatDate(data[i].current_Date)
            }
        }
        return graphData;
    };

     formatDate1 = (inputDate) => {
        const dateParts = inputDate.split(' ')[0].split('-');
        const day = dateParts[2];
        const month = dateParts[1];
        const year = dateParts[0];

        return `${day}/${month}/${year}`;
    };


    render() {
        const summaryData = this.props.data;
        const schedulesData = this.props.schedule;

        const { editable, inputValue } = this.state;

        let loanAm = this.props.amount;
        let loanP = this.props.period;
        let loanS = this.props.start;
        let rate = this.props.rate;
        let app = this.props.approval;
        let ins = this.props.insuren;
        let other = this.props.other;
        let account = this.props.loanaccount;

        console.log(this.props)

        console.log(schedulesData);

        console.log( this.placeholder1 )

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
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
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

                <div>
                    <div className="card"  style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                        <div className="card-body">
                            <div>
                                <div style={{ display: "flex", minWidth: "600px" }}>
                                    <div style={{ marginRight: "auto" }} className="thElement">  Input </div>
                                    <div className="thElement">  </div>

                                    <button  className="defaultButton">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" fill="currentColor" className="bi bi-filetype-pdf" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z" />
                                        </svg>
                                    </button>

                                    <button onClick={this.handleClik.bind(this)} className="defaultButton">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                        </svg>
                                    </button>


                                </div>
                                <hr></hr>
                                <MDBTable borderless responsive style={{ minWidth: "600px", margin: "auto" }}>
                                    <MDBTableHead >
                                        <tr>
                                            <th className="thElement" scope='col'> Loan amount</th>
                                            <th className="thElement" scope='col'> Loan period</th>
                                            <th className="thElement" scope='col'> Loan start</th>
                                            <th className="thElement" scope='col'> Loan interest rate</th>
                                            {/*<th className="thElement" scope='col'> Approval</th>*/}
                                            {/*<th className="thElement" scope='col'> Insurence</th>*/}
                                            {/*<th className="thElement" scope='col'> Account</th>*/}
                                            {/*<th className="thElement" scope='col'> Other costs</th>*/}
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody >
                                        <tr>
                                            <td className="tdElement">
                                                <input type="number" className="inputEl" disabled={(this.state.disabled) ? "disabled" : ""} placeholder={loanAm} /> 
                                            </td>
                                            <td className="tdElement">
                                                <input type="number" className="inputEl" disabled={(this.state.disabled) ? "disabled" : ""} placeholder={loanP} />
                                            </td>
                                            <td className="tdElement">
                                                <input className="inputEl" disabled={(this.state.disabled) ? "disabled" : ""} placeholder={this.formatDate1(loanS)}  />
                                            </td>
                                            <td className="tdElement">
                                                <input type="number" className="inputEl" disabled={(this.state.disabled) ? "disabled" : ""} placeholder={rate} />
                                            </td>
                                        </tr>
                                    </MDBTableBody>
                                </MDBTable>

                            </div>
                        </div>
                    </div>
                </div>
                    

                {summaryData  ?
                    <div>

                        <div style={{ overflowX: "auto" }}>
                            <div style={{ marginTop: "1%" }}>
                                <div className="col" style={{ margin: "auto", marginTop: "5%" }}>
                                    <div className="card" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                                        <div className="card-body">
                                            <div style={{ display: "flex"}}>
                                                <p style={{ marginRight: "auto", fontWeight: "bolder", fontSize: "20px" }} className="card-text">SUMMARY</p>
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
                        <br></br>

                        <div>
                            <LineChart 
                                width={900}
                                height={400}
                                data={this.getGraphData(schedulesData)}
                                margin={{
                                    top: 20,
                                    right: 40,
                                    left: -10,
                                    bottom: -10,
                                }}

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
                                                    <td >{this.formatDate(d.current_Date)}</td>
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