import React from 'react';
import axios from "axios";
import "./style.css";
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

class history extends React.Component {

    //constructor
    constructor(props) {
        super(props);
        this.state = {
            calculation: []
        };

    };

    //function for page
    QSetViewInParent = (obj) => {
        this.props.QIDFromChild(obj);
    };

    QSetView = (obj) => {
        this.setState({
            CurrentPage: obj.page
        });
    };

    componentDidMount() {
        // Perform both the axios request and dynamic import using Promise.all

        axios.get('https://localhost:7224/CalculateAmortizationPlan', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                console.log(response.data);
                this.setState({
                    calculation: response.data,
                });
            }).catch(error => {
                console.error(error.response); // Log the error response for debugging
            });
    }
    getPdf = (reqid) => {
        console.log(typeof (reqid));
        axios.post('https://localhost:7224/CalculateAmortizationPlan/generatepdf', {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            params: {
                reqName: reqid
            }
        })
            .then((response) => {
                // Handle the response or do any necessary processing here
                // Redirect to the PDF file once it's generated
                //window.location.href (`C:/Users/spachemska.DIZ2555/Desktop/ultra/AmortizationScheduleCalculator/AmortizationScheduleCalculator/7.pdf`);
                <object data="http://africau.edu/images/default/sample.pdf" type="application/pdf" width="100%" height="100%">
                    <p>Alternative text - include a link <a href="http://africau.edu/images/default/sample.pdf">to the PDF!</a></p>
                </object>
            })
            .catch(error => {
                console.error(error.response); // Log the error response for debugging
            });
    }

    //function for formatting date
    formatDate = (dateString) => {
        const dateObject = new Date(dateString);
        const options = { year: 'numeric', month: 'short' };
        return dateObject.toLocaleDateString(undefined, options);
    };

    render() {
        let data = this.state.calculation;
        //let lastElement = data.length > 0 ? data[data.length - 1] : null;
        const name = localStorage.getItem('name');
        const surname = localStorage.getItem('surname');

        return (
            <div>
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
                            <button type="button" onClick={() => this.QSetViewInParent({ page: "profile" })} className="btn btn-outline me-2">New calculation</button>
                            <button type="button" onClick={() => { this.QSetViewInParent({ page: "login" }); localStorage.setItem('token', ""); localStorage.setItem('name', ""); localStorage.setItem('surname', "") }} className="btn">Logout</button>
                        </div>
                    </header>
                </div>
                <br></br>
                <h3 style={{ fontFamily: "Segoe UI", fontWeight: "400" }}>Request history</h3>

                {data.length > 0 ?
                    data.map((d, index) => {
                        return (

                            <div style={{ overflowX: "auto" }}>
                                <div style={{ width: "60%", margin: "auto", marginTop: "4%", marginBottom: "4%" }}>
                                    <div className="col" style={{ margin: "auto", }}>
                                        <div className="card" key={index} style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                                            <div className="card-body">
                                                <div>
                                                    <div style={{ display: "flex" }}>
                                                        <div style={{ marginRight: "auto" }} className="thElement">  Request name: {d.request_Name}  </div>
                                                        <button onClick={() => this.QSetViewInParent({ page: "Schedule", idForSchedule: d.request_Id })} className="defaultButton">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" className="bi bi-calendar-plus" >
                                                                <path d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
                                                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                                                            </svg>
                                                        </button>

                                                        <button onClick={() => this.getPdf(d.request_Id)} className="defaultButton">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" fill="currentColor" class="bi bi-filetype-pdf" viewBox="0 0 16 16">
                                                                <path fillRule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z" />
                                                            </svg>
                                                        </button>


                                                    </div>

                                                    <div>
                                                        <hr></hr>
                                                        <MDBTable borderless responsive style={{ minWidth: "200px", margin: "auto" }}>
                                                            <MDBTableHead >
                                                                <tr>
                                                                    <th className="thElement" scope='col'>Monthly payment</th>
                                                                    <th className="thElement" scope='col'>Total interest paid</th>
                                                                    <th className="thElement" scope='col'>Total cost of loan</th>
                                                                    <th className="thElement" scope='col'>Payoff date</th>
                                                                </tr>
                                                            </MDBTableHead>
                                                            <MDBTableBody key={d.request_Id} >
                                                                <tr>
                                                                    <td className="tdElement">{d.monthly_Payment}&euro;</td>
                                                                    <td className="tdElement">{d.total_Interest_Paid}&euro;</td>
                                                                    <td className="tdElement">{d.total_Loan_Cost}&euro;</td>
                                                                    <td className="tdElement">{this.formatDate(d.loan_Payoff_Date)}</td>
                                                                </tr>
                                                            </MDBTableBody>
                                                        </MDBTable>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        );
                    })
                    : "Loading.."}
            </div>
        );
    }
}

export default history;