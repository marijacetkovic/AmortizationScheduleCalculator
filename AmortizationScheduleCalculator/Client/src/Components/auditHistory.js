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
            auditHistory: {}
        }

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

        console.log(this.props.redId);

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
        const data = this.state.auditHistory;

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

                {
                    data.length > 0 ?
                        data.map((d, index) => {
                            return (
                                <MDBRow className='row-cols-1 row-cols-md-1 g-4' style={{ margin: "auto", maxWidth: '500px' }}>
                                    <MDBCol>
                                        <MDBCard style={{ backgroundColor: "#DDE6ED" }}>

                                            <MDBCardBody>
                                                <MDBCardTitle>{d.request_Name}</MDBCardTitle>
                                                <br></br>
                                                <MDBCardText style={{ textAlign: "left" }}>
                                                    Date issued: {this.formatDateWithHour(d.date_Issued)}
                                                    <br></br>
                                                    Issuer: {d.issuer}
                                                    <br></br>
                                                </MDBCardText>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </MDBCol>

                                </MDBRow>
                            )
                        })
                        : "Loading.."
                }
            </div>
                
            )
           
        }
    
}




export default AuditHistory;