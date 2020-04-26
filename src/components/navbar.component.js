import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../App.css"

export default class Navbar extends Component {

  render() {
    return (
      <nav style={{display: "flex", flexDirection: "row", alignItems: "center", height: 80}}>
        <img style={{marginRight: ".75em"}} width={'150px'} height={'150px'} src="https://www.freelogodesign.org/file/app/client/thumb/d6105bd8-530c-473d-bff5-462413216ddf_200x200.png?1587883805222" />
        <Link to="/" style={{fontSize: 28, color: "rgb(255, 77, 77)", fontFamily: "sans-serif", fontWeight: 700}}>Name</Link>
        <Link to="/" className="navBarLink" style={{marginLeft: 40}}>Tasks</Link>
        <Link to="/create" className="navBarLink" style={{marginLeft: 40}}>Upload File</Link>
        <Link to="/user" className="navBarLink" style={{marginLeft: 40}}>Sign Up</Link>
      </nav>
    );
  }
}
