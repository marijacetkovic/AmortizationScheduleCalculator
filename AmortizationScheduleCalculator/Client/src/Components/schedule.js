import React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import axios from 'axios';
import "./style.css";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
export const MContext = React.createContext();

class Schedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            schedule: {},
            calculation: {}
        };
    };

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

    QSetViewInParent = (obj) => {
        this.props.QIDFromChild(obj);
    };

    componentDidMount() {

        this.checkTokenExpiry();

        var idR = this.props.idR;
        console.log(typeof idR)
        const token = localStorage.getItem('token');
        axios.get('https://localhost:7224/CalculateAmortizationPlan/schedule', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                reqName: idR
            }
        }).then(response => {
            console.log(response.data)
            this.setState({
                schedule: response.data.schedules,
                calculation: response.data.summary

            })
        }).catch(error => {
            console.error(error.response); // Log the error response for debugging
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

    getPdf = (reqid) => {
        console.log(typeof (reqid));
        axios.post('https://localhost:7224/CalculateAmortizationPlan/generatepdf', {}, {
            responseType: 'arraybuffer',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            params: {
                reqName: reqid
            }
        })
            .then((response) => {

                console.log(response)
                this.setState({ pdfData: response.data }, () => {
                    // The callback function is executed after the state is updated
                    const { pdfData } = this.state;
                    console.log(typeof (pdfData))
                    // Check if PDF data is available
                    if (pdfData) {
                        const blob = new Blob([pdfData], { type: 'application/pdf' });
                        const pdfUrl = URL.createObjectURL(blob);
                        console.log(blob)

                        // Open the PDF in a new tab
                        window.open(pdfUrl, '_blank');
                    }
                });
            })
            .catch(error => {
                console.error(error.response); // Log the error response for debugging
            });
    }



    render() {
        let data = this.state.schedule;
        console.log(data)
        const name = localStorage.getItem('name');
        const surname = localStorage.getItem('surname');
        let calc = this.state.calculation;
        console.log(calc);

        const pieChart = [
            { name: 'Principal Paid', value: calc.loan_Amount },
            { name: 'Interest Paid', value: calc.total_Interest_Paid },
            { name: 'Other costs', value: calc.total_Other_Costs }
        ];

        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }} className="calculationCenter">

                <div className="container">
                    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-3 border-bottom">
                        <div>
                            <button className="uniButton" onClick={() => this.QSetViewInParent({ page: "history" })}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
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
                            <button type="button" onClick={() => this.QSetViewInParent({ page: "profile" })} className="btn btn-outline me-2">New calculation</button>
                            <button type="button" onClick={() => { this.QSetViewInParent({ page: "login" }); localStorage.setItem('token', ""); localStorage.setItem('name', ""); localStorage.setItem('surname', "") }} className="btn">Logout</button>
                        </div>
                    </header>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <div style={{ marginTop: "1%" }}>
                        <div className="col" style={{ margin: "auto", marginTop: "5%" }}>
                            <div className="card" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                                <div className="card-body">
                                    <div style={{ display: "flex" }}>
                                        <p style={{ marginRight: "auto", fontWeight: "bolder", fontSize: "20px" }} className="card-text">SUMMARY</p>
                                        <button onClick={() => this.getPdf(calc.request_Id)} className="defaultButton">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" fill="currentColor" className="bi bi-filetype-pdf" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => this.QSetViewInParent({ page: "editschedule", editnew: calc })} className="defaultButton">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                            </svg>
                                        </button>
                                    </div>

                                    <hr></hr>
                                    <div className="table-container">
                                    <MDBTable borderless responsive style={{margin: "auto" }}>
                                        <MDBTableHead>
                                            <tr>
                                                <th className="thElement" scope='col'>Request name</th>
                                                <th className="thElement" scope='col'>Monthly payment</th>
                                                <th className="thElement" scope='col'>Total interest paid</th>
                                                <th className="thElement" scope='col'>Total cost of loan</th>
                                                <th className="thElement" scope='col'>Total other costs</th>
                                                <th className="thElement" scope='col'>Payoff date</th>
                                            </tr>
                                        </MDBTableHead>
                                        <MDBTableBody>
                                            <tr>
                                                <td className="tdElement">{calc.request_Name}</td>
                                                <td className="tdElement">{calc.monthly_Payment}&euro;</td>
                                                <td className="tdElement">{calc.total_Interest_Paid}&euro; </td>
                                                <td className="tdElement">{calc.total_Loan_Cost}&euro;</td>
                                                <td className="tdElement">{calc.total_Other_Costs}&euro;</td>
                                                <td className="tdElement">{this.formatDate(calc.loan_Payoff_Date)}</td>
                                            </tr>

                                        </MDBTableBody>
                                        </MDBTable>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

           

                <div style={{ display: 'flex', width: '50%', margin: "auto" }}>
                    <div style={{ width: '100%' }}>
                        <LineChart
                            className="line-chart-container"
                            width={600}
                            height={400}
                            data={this.getGraphData(data)}
                            margin={{
                                top: 20,
                                right: 40,
                                left: -25,
                                bottom: -10,
                            }} 

                        >
                            <CartesianGrid />

                            <XAxis dataKey="Date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Principal" stroke="#27374D" />
                            <Line type="monotone" dataKey="Interest" stroke="#526D82" />
                            <Line type="monotone" dataKey="Balance" stroke="#9DB2BF" />
                        </LineChart>

                    </div>

                    <div style={{ width: '100%' }}>
                        <ResponsiveContainer width={350 } height={350}>
                            <PieChart>
                                <Pie data={pieChart} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="#27374D" />
                                <Pie data={pieChart} dataKey="value" cx="50%" cy="50%" innerRadius={90} outerRadius={120} fill="#9DB2BF" label />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>


                <div style={{ width: "100%", maxWidth: "1100px" }}>
                    <MDBTable className="responsive-table" responsive striped hover style={{ margin: "auto", marginTop: "60px" }}>
                            <MDBTableHead >
                            <tr >
                                <th className="thSchedule" style={{ backgroundColor: "#526D82", color: "#fafdff" }} scope='col'>#</th>
                                    <th className="thSchedule" style={{ backgroundColor: "#526D82", color: "#fafdff" }} scope='col'>Date</th>
                                    <th className="thSchedule" style={{ backgroundColor: "#526D82", color: "#fafdff" }} scope='col'>Monthly payment</th>
                                    <th className="thSchedule" style={{ backgroundColor: "#526D82", color: "#fafdff" }} scope='col'>Principal</th>
                                    <th className="thSchedule" style={{ backgroundColor: "#526D82", color: "#fafdff" }} scope='col'>Interest</th>
                                    <th className="thSchedule" style={{ backgroundColor: "#526D82", color: "#fafdff" }} scope='col'>Monthly costs</th>
                                    <th className="thSchedule" style={{ backgroundColor: "#526D82", color: "#fafdff" }} scope='col'>Remaining balance</th>
                                </tr>
                            </MDBTableHead>

                            {data.length > 0 ?
                                data.map((d, index) => {
                                    return (
                                        <MDBTableBody key={d.schedule_Id}>
                                            <tr>
                                                <td>{ index + 1 }</td>
                                                <td>{this.formatDate(d.current_Date)}</td>
                                                <td >{d.monthly_Paid}&euro;</td>
                                                <td >{d.principal_Paid}&euro;</td>
                                                <td >{d.interest_Paid}&euro;</td>
                                                <td >{d.monthly_Costs}&euro;</td>
                                                <td >{d.remaining_Loan}&euro;</td>
                                            </tr>
                                        </MDBTableBody>

                                    )
                                })
                                : "Loading.."}
                        </MDBTable>
                    </div>

                
            </div>
        );
    }
}

export default Schedule;