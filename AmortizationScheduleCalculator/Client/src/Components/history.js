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
        Promise.all([
            axios.get('https://localhost:7224/CalculateAmortizationPlan', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }),
            import("./schedule") // Assuming "./schedule" is the correct path to the 'schedule' component
        ]).then(([response, module]) => {
            console.log(response.data);
            this.setState({
                calculation: response.data,
            });
        }).catch(error => {
            console.error(error.response); // Log the error response for debugging
        });
    }

    //componentDidMount() {
    //    axios.get('https://localhost:7224/CalculateAmortizationPlan', {
    //        headers: {
    //            Authorization: `Bearer ${localStorage.getItem('token')}`
    //        }
    //    }).then(response => {
    //        console.log(response.data)
    //        //const requestName = response.data.request_Name;
    //        this.setState({
    //            calculation: response.data,
    //        })
    //    }),
    //        import("./schedule").then((module) => {

    //            const schedule = module.default;
    //            this.setState({ schedule });
    //        });
    //};

    //function for formatting date
    formatDate = (dateString) => {
        const dateObject = new Date(dateString);
        const options = { year: 'numeric', month: 'short' };
        return dateObject.toLocaleDateString(undefined, options);
    };

    state = { reqName: "" }

    render() {
        let data = this.state.calculation;
        //let lastElement = data.length > 0 ? data[data.length - 1] : null;
        const name = localStorage.getItem('name');
        const surname = localStorage.getItem('surname');
        const { calculaton, schedule } = this.state;

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
                                                        {/*{schedule && <schedule request_Name={d.request_Name} />}*/}
                                                         <button onClick={() => this.QSetViewInParent({ page: "Schedule" })} className="defaultButton" />
                                                        <button onClick={() => this.QSetViewInParent({ page: "Schedule" })} className="defaultButton">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" className="bi bi-calendar-plus" >
                                                                <path d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
                                                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
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
                                                            <MDBTableBody >
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