import React from "react";
import './App.css';
import axios from "axios";
import Home from './Components/home';
import Profile from './Components/profile';
import Login from './Components/login';
import RegForm from "./Components/RegisForm";
import Schedule from "./Components/schedule";
import Calculation from "./Components/calculation";
import History from "./Components/history";


class App extends React.Component {

    ///The constructor of our app.
    constructor(props) {
        super(props);
        //state is where our "global" variable will be store
        this.state = {
            CurrentPage: "login", token: "", calculation: {} , calculation1: [], idReq: 1
        };

    };


    QGetView = (state) => {

        let page = state.CurrentPage;

        switch (page) {
            //on profile is calculator
            case "profile":
                return <Profile QIDFromChild={this.QSetView} />;
            case "login":
                return <Login QIDFromChild={this.QSetView} />;
            case "registration":
                return <RegForm QIDFromChild={this.QSetView} />;
            case "Schedule":
                return <Schedule idR={this.state.idReq} QIDFromChild={this.QSetView} />;
            case "calculation":
                return < Calculation data={this.state.calculation} schedule={this.state.calculation1} QIDFromChild={this.QSetView}  />;
            case "history":
                return <History QIDFromChild={this.QSetView} />;
            default:
                return <Login />;

        }
    };

    QSetView = (obj) => {
        this.setState({
            CurrentPage: obj.page,
            calculation: obj.sum || {},
            calculation1: obj.schedules || [],
            idReq: obj.idForSchedule || 0
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