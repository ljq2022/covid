import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <img style={{marginRight: ".75em"}} width={'150px'} height={'150px'} src="https://www.freelogodesign.org/file/app/client/thumb/d6105bd8-530c-473d-bff5-462413216ddf_200x200.png?1587883805222" />
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/" className="nav-link" style={{fontSize:"30px", marginLeft: ".75em", marginRight: ".75em"}}>Tasks</Link>
          </li>
          <li className="navbar-item">
          <Link to="/create" className="nav-link" style={{fontSize:"30px", marginLeft: ".75em", marginRight: ".75em"}}>Create Task</Link>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}
