import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../App.css"
import dAlgonisticLogo from "../dAlgonisticLogo.png"

export default class Navbar extends Component {

  render() {
    return (
      <nav style={{display: "flex", flexDirection: "row", alignItems: "center", height: 80}}>
        <img style={{marginRight: ".75em"}} width={90} height={90} src={dAlgonisticLogo} />
        <Link to="/" className="navBarLink" style={{marginLeft: 40}}>Tasks</Link>
        <Link to="/create" className="navBarLink" style={{marginLeft: 40}}>Upload File</Link>
        <Link to="/user" className="navBarLink" style={{marginLeft: 40}}>{localStorage.getItem("loggedInUsername") === "" ? "Sign Up" : "Log Out"}</Link>
      </nav>
    );
  }
}
