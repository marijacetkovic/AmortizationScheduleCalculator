import React from 'react';
import  { MDBTable, MDBTableHead, MDBTableBody }  from 'mdb-react-ui-kit';

class Schedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
      }

    render(){
        return (
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
                <th scope='row'>1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>@mdo</td>
                </tr>
                <tr>
                <th scope='row'>2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>@mdo</td>
                </tr>
                <tr>
                <th scope='row'>2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>@mdo</td>
                </tr>
                <tr>
                <th scope='row'>2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>@mdo</td>
                </tr>
                <tr>
                <th scope='row'>2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>@mdo</td>
                </tr>
            </MDBTableBody>
            </MDBTable>
        );
        }
}

export default Schedule;