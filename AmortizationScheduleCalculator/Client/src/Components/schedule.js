import React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import axios from 'axios';
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

    render() {

        let data = this.state.schedule;

        return (
            <div>

                <div className="container">
                    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-3 border-bottom">
                        <a className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                            <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
                        </a>

                        <div id="title">Amortization Calculator </div>

                        <div className="col-md-3 text-end">
                            <button type="button" onClick={() => this.QSetViewInParent({ page: "profile" })} className="btn btn-outline me-2">New calculation</button>
                            <button type="button" onClick={() => { this.QSetViewInParent({ page: "login" }); localStorage.setItem('token', ""); localStorage.setItem('name', ""); localStorage.setItem('surname', "") }} className="btn">Logout</button>
                        </div>
                    </header>
                </div>

                <div>
                    <div>
                        <MDBTable striped hover style={{ maxWidth: "1000px", margin: "auto" }}>
                            <MDBTableHead >
                                <tr>
                                    <th style={{ backgroundColor: "#526D82" }} scope='col'>Date</th>
                                    <th style={{ backgroundColor: "#526D82" }} scope='col'>Monthly payment</th>
                                    <th style={{ backgroundColor: "#526D82" }} scope='col'>Principal</th>
                                    <th style={{ backgroundColor: "#526D82" }} scope='col'>Interest</th>
                                    <th style={{ backgroundColor: "#526D82" }} scope='col'>Remaining balance</th>
                                </tr>
                            </MDBTableHead>

                            {data.length > 0 ?
                                data.map((d) => {
                                    return (
                                        <MDBTableBody key={d.schedule_Id}>
                                            <tr>
                                                <td>{this.formatDate(d.current_Date)}</td>
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
            </div>
        );
    }
}

export default Schedule;