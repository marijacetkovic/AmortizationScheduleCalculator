import React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import axios from 'axios';
import "./style.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
export const MContext = React.createContext();

class Schedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            schedule: {}
        };
    };

    QSetViewInParent = (obj) => {
        this.props.QIDFromChild(obj);
    };

    componentDidMount() {

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
                schedule: response.data.schedules

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


    render() {

        let data = this.state.schedule;
        const name = localStorage.getItem('name');
        const surname = localStorage.getItem('surname');

        return (
            <div className="calculationCenter">

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

           

                <div>
                    <div>
                        <LineChart
                            width={900}
                            height={400}
                            data={this.getGraphData(data)}
                            margin={{
                                top: 20,
                                right: 40,
                                left: -12,
                                bottom: 5,
                            }} 
                            minWidth= "900px"

                        >
                            <CartesianGrid />

                            <XAxis dataKey="Date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Principal" stroke="#8884d8" />
                            <Line type="monotone" dataKey="Interest" stroke="#d990d8" />
                            <Line type="monotone" dataKey="Balance" stroke="#82ca9d" />
                        </LineChart>

                    </div>
                    <br></br>

                    <div>
                        <MDBTable responsive striped hover style={{ maxWidth: "900px", margin: "auto" }}>
                            <MDBTableHead >
                                <tr >
                                    <th className="thSchedule" style={{ backgroundColor: "#526D82", color: "#fafdff" }} scope='col'>Date</th>
                                    <th className="thSchedule" style={{ backgroundColor: "#526D82", color: "#fafdff" }} scope='col'>Monthly payment</th>
                                    <th className="thSchedule" style={{ backgroundColor: "#526D82", color: "#fafdff" }} scope='col'>Principal</th>
                                    <th className="thSchedule" style={{ backgroundColor: "#526D82", color: "#fafdff" }} scope='col'>Interest</th>
                                    <th className="thSchedule" style={{ backgroundColor: "#526D82", color: "#fafdff" }} scope='col'>Remaining balance</th>
                                </tr>
                            </MDBTableHead>

                            {data.length > 0 ?
                                data.map((d) => {
                                    return (
                                        <MDBTableBody key={d.schedule_Id}>
                                            <tr style={{ backgroundColor: "#9DB2BF"} }>
                                                <td style={{ backgroundColor: "#eef3f6" }}>{this.formatDate(d.current_Date)}</td>
                                                <td style={{ backgroundColor: "#eef3f6" }}>{d.monthly_Paid}&euro;</td>
                                                <td style={{ backgroundColor: "#eef3f6" }}>{d.principal_Paid}&euro;</td>
                                                <td style={{ backgroundColor: "#eef3f6" }}>{d.interest_Paid}&euro;</td>
                                                <td style={{ backgroundColor: "#eef3f6" }}>{d.remaining_Loan}&euro;</td>
                                            </tr>
                                        </MDBTableBody>

                                    )
                                })
                                : "Loading.."}
                        </MDBTable>
                    </div>

                </div>
            </div>
        );
    }
}

export default Schedule;