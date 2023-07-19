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
        );
 }
}

export default Schedule;