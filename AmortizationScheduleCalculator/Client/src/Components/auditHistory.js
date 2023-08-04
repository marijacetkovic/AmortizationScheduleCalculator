import React from "react";
import './style.css';
import axios from "axios";
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';

class AuditHistory extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            auditHistory: []
        }

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

    componentDidMount() {

        this.checkTokenExpiry();

        const id = this.props.redId;

        axios.get('https://localhost:7224/CalculateAmortizationPlan/audithistory', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            params: {
                parentReqName: id + ""
            }
        })
            .then((response) => {
                console.log(response.data);
                this.setState({
                    auditHistory: response.data,
                });
            }).catch(error => {
                console.error(error.response); // Log the error response for debugging
            });
    };

    formatDateWithHour = (dateString) => {
        if (!dateString) return ""; // Return empty string if dateString is not provided

        const dateObj = new Date(dateString);
        const day = dateObj.getDate().toString().padStart(2, "0");
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObj.getFullYear();
        const hours = dateObj.getHours().toString().padStart(2, "0");
        const minutes = dateObj.getMinutes().toString().padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };


    render() {

        const name = localStorage.getItem('name');
        const surname = localStorage.getItem('surname');
        console.log(this.state.auditHistory)
        let data = this.state.auditHistory;
        data= data.slice().reverse();

        const firstRequestName = data && data.length > 0 ? data[0].request_Name : '';

        console.log(firstRequestName)

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

                <h3>Request name: {firstRequestName}</h3> 

                {
                    data.length > 0 ?
                        data.map((d, index) => {
                            return (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem",padding: "2rem", width: "400px", minWidth: "30%", margin: "auto" }}>
                                    <MDBCol>
                                        <MDBCard style={{
                                            backgroundColor: "rgb(236, 243, 248)", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", border: "#526D82"}}>

                                            <MDBCardBody>
                                                {/*<MDBCardTitle>Request name: {d.request_Name}</MDBCardTitle>*/}
                                                <button onClick={() => this.QSetViewInParent({ page: "Schedule", idForSchedule: d.request_Id })} style={{ margin: "right", border: "none", backgroundColor: "rgb(236, 243, 248)" }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" className="bi bi-calendar-plus" >
                                                        <path d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
                                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                                                    </svg>
                                                </button>
                                                
                                                <MDBCardText style={{ textAlign: "centar", color: "#27374D" }}>
                                                    Date issued: {this.formatDateWithHour(d.date_Issued)}
                                                    <br></br>
                                                    <div> Issuer: {d.issuer} </div>
                                                    <hr></hr>
                                                    <div>Loan amount: {d.loan_Amount } </div>
                                                    <div>Loan period: {d.loan_Period } </div>
                                                    <div>Interest rate: {d.interest_Rate} </div>

                                                </MDBCardText>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </MDBCol>
                                    
                                </div>
                            )
                        })
                        : "Loading.."
                }
            </div>
                
            )
           
        }
    
}




export default AuditHistory;