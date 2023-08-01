import React from 'react';
import axios from "axios";
import "./style.css";
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

class history extends React.Component {

    //constructor
    constructor(props) {
        super(props);
        this.state = {
            calculation: [],
            pdfData: null
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

        axios.get('https://localhost:7224/CalculateAmortizationPlan/getallrequests', {
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
                    console.log(typeof(pdfData))
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

    deleteReq = (reqid) => {
        console.log(typeof (reqid));
        axios.get('https://localhost:7224/CalculateAmortizationPlan/deleterequest',{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            params: {
                reqName: reqid
            }
        })
            .then((response) => {
                console.log(response)
                
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
        const name = localStorage.getItem('name');
        const surname = localStorage.getItem('surname');

        return (
            <div>
                <div className="container">
                    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-3 border-bottom">
                        <div>
                            <button className="uniButton" onClick={() => this.QSetViewInParent({ page: "profile" })}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                </svg>
                            </button>
                        </div>
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
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" fill="currentColor" className="bi bi-filetype-pdf" viewBox="0 0 16 16">
                                                                <path fillRule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z" />
                                                            </svg>
                                                        </button>

                                                        <button onClick={() => this.QSetViewInParent({ page: "editcalculation", req_id: d.request_Id })} className="defaultButton">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                            </svg>
                                                        </button>


                                                        <button onClick={() => this.QSetViewInParent({ page: "auditHistory"})} className="defaultButton">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">
                                                                <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
                                                                <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
                                                                <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
                                                            </svg>
                                                        </button>

                                                        <button onClick={() => this.deleteReq(d.request_Id)}  className="defaultButton">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
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
                    : "Loading.."
                    //: alert("No Requests")
                }
            </div>
        );
    }
}

export default history;