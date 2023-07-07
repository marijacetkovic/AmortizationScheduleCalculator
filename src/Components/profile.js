import React from "react";

class Home extends React.Component {
  componentDidMount() {
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "#f2f3f4";
  }
  render() {
    return (
        <div>Hello!</div>
    );
    }
}


export default Home;