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



class App extends React.Component {

    ///The constructor of our app.
    constructor(props) {
        super(props);
        //state is where our "global" variable will be store
        this.state = {
            CurrentPage: "login", token: "", calculation: {}, calculation1: [], idReq: 1, reqNameEdit: {},
            loanA: 0,
            loanP: 0,
            loanS:  0,
            loanR:  0,
            loanAp:  0,
            loanIc:  0,
            loanOc:  0 
        };

    };


    QGetView = (state) => {

        let page = state.CurrentPage;

        switch (page) {
            //on profile is calculator
            case "profile":
                return <Profile editSchedule={ this.state.reqNameEdit} QIDFromChild={this.QSetView} />;
            case "login":
                return <Login QIDFromChild={this.QSetView} />;
            case "registration":
                return <RegForm QIDFromChild={this.QSetView} />;
            case "Schedule":
                return <Schedule idR={this.state.idReq} QIDFromChild={this.QSetView} />;
            case "calculation":
                return < Calculation amount={this.state.loanA} period={this.state.loanP} start={this.state.loanS} rate={this.state.loanR} approval={this.state.loanAp} loanaccount={ this.state.loanAp} insuren={this.state.loanIc} other={this.state.loanOc} data={this.state.calculation} schedule={this.state.calculation1} QIDFromChild={this.QSetView} />;
            case "history":
                return <History QIDFromChild={this.QSetView} />;
            case "pdf":
                return <Pdf QIDFromChild={this.QSetView} />;
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
            reqNameEdit: obj.reqNameSame || [],
            loanA: obj.loan || 0,
            loanP: obj.loanperiod || 0,
            loanS: obj.loanStart || 0,
            loanR: obj.interestR || 0,
            loanAp: obj.appC || 0,
            loanIc: obj.insC || 0,
            loanOc: obj.otherC || 0 
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