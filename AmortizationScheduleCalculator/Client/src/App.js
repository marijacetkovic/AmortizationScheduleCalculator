import React from "react";
import './App.css';
import axios from "axios";
import Home from './Components/home';
import Profile from './Components/profile';
import Pdf from './Components/pdf';
import Login from './Components/login';
import RegForm from "./Components/RegisForm";
import Schedule from "./Components/schedule";
import Calculation from "./Components/calculation";
import History from "./Components/history";
import EditSchedule from "./Components/edited";
import EditCalculation from "./Components/editcalculation";



class App extends React.Component {

    ///The constructor of our app.
    constructor(props) {
        super(props);
        //state is where our "global" variable will be store
        this.state = {
            CurrentPage: "login", token: "", calculation: {}, calculation1: [], idReq: 1, edited: {},
            loanA: 0,
            loanP: 0,
            loanS:  0,
            loanR:  0,
            loanAp:  0,
            loanIc:  0,
            loanOc: 0,
            editCalculation: [], editCalculation1:[]
        };

    };


    QGetView = (state) => {

        let page = state.CurrentPage;

        switch (page) {
            // profile is the calculator
            case "profile":
                return <Profile editSchedule={this.state.edited} QIDFromChild={this.QSetView} />;
            case "login":
                return <Login QIDFromChild={this.QSetView} />;
            case "registration":
                return <RegForm QIDFromChild={this.QSetView} />;
            case "Schedule":
                return <Schedule idR={this.state.idReq} QIDFromChild={this.QSetView} />;
            case "calculation":
                return < Calculation data={this.state.calculation} schedule={this.state.calculation1} QIDFromChild={this.QSetView} />;
            case "history":
                return <History QIDFromChild={this.QSetView} />;
            case "pdf":
                return <Pdf QIDFromChild={this.QSetView} />;
            case "editschedule":
                return <EditSchedule editSchedule={this.state.edited} QIDFromChild={this.QSetView} />;
            case "editcalculation":
                return <EditCalculation editCalSummary={this.state.editCalculation} editCalSchedule={this.state.editCalculation1 } QIDFromChild={this.QSetView} />;
            default:
                return <Login />;

        }
    };

    QSetView = (obj) => {
        this.setState({
            CurrentPage: obj.page,
            calculation: obj.sum || {},
            calculation1: obj.schedules || [],
            idReq: obj.idForSchedule || 0,
            edited: obj.editnew || {},
            editCalculation: obj.editSum || {},
            editCalculation1: obj.editSchedules || [],
            
        });
    };

    render() {

        return (

            <div className="App">

                <div id="viewer">
                    {this.QGetView(this.state)}
                </div>

            </div>
        );
    }
}

export default App;