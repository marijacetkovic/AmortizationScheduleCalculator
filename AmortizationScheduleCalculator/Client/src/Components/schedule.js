import React from 'react';
import  { MDBTable, MDBTableHead, MDBTableBody }  from 'mdb-react-ui-kit';
import axios from 'axios';

class Schedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            schedule: []
        };
      };

      QSetViewInParent = (obj) => {
        this.props.QIDFromChild(obj);
    };

    componentDidMount()
      {
        axios.get('https://localhost:7224/CalculateAmortizationPlan/schedule ')
        .then(response=>{
            console.log(response.data)
          this.setState({
            schedule:response.data
          })
        })
      };
        

    render(){
        let data=this.state.schedule;

            return (
                <div>

                        <div className="container">
                          <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-3 border-bottom">
                             <a href="#" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                                <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
                            </a>

                        <div id="title">Amortization Calculator </div>

                        <div className="col-md-3 text-end">
                            <button type="button" onClick={() => this.QSetViewInParent({ page: "calculation" })} className="btn btn-outline me-2">New calculation</button>
                            <button type="button" onClick={() => this.QSetViewInParent({ page: "login" })} className="btn">Logout</button>
                        </div>
                         </header>
                      </div> 

                 <div> 
                <MDBTable striped hover style={{maxWidth: "1000px", margin:"auto"}}>
                    <MDBTableHead >
                    <tr>
                    <th  style={{backgroundColor: "#526D82"}} scope='col'>Year</th>
                    <th  style={{backgroundColor: "#526D82"}} scope='col'>Month</th>
                    <th  style={{backgroundColor: "#526D82"}} scope='col'>Interest</th>
                    <th  style={{backgroundColor: "#526D82"}} scope='col'>Principal</th>
                    <th  style={{backgroundColor: "#526D82"}} scope='col'>Remaining balance</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <th>2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@mdo</td>
                    </tr>
                </MDBTableBody>
                </MDBTable>
                </div>
                </div>
        );
 }
}

export default Schedule;