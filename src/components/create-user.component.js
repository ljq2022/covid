import React, { Component } from 'react';
import axios from 'axios';

export default class CreateUser extends Component {
  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      username: ''
    }
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      username: this.state.username
    }

    console.log(user);


    axios.post('http://localhost:5000/users/add/', user)
      .then(res => console.log(res.data));

    this.setState({
      username: ''
    })
  }

  render() {
    return (
      <div>
        <label style={{fontSize: 30, fontWeight: 600, textDecoration: "underline"}}>Sign Up</label>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label style={{fontFamily: "sans-serif"}}>Username: </label>
            <input  type="text"
                required
                className="form-control"
                value={this.state.username}
                onChange={this.onChangeUsername}
                placeholder="your superhero name"
                />
          </div>
          <div className="form-group">
            <label style={{fontFamily: "sans-serif"}}>Email: </label>
            <input type="text"
                required
                className="form-control"
                placeholder="how should we reach you?" />
          </div>
          <div className="form-group">
            <label style={{fontFamily: "sans-serif"}}>Password: </label>
            <input type="text"
                required
                className="form-control"
                placeholder="confidential info" />
          </div>
          <div className="form-group">
            <input type="submit" value="🤝Sign Up" style={{backgroundColor: "white", borderWidth: 0, paddingLeft: 8, paddingRight: 8, paddingBottom: 3, paddingTop: 3, borderColor: "rgb(255, 77, 77)", color: "rgb(255, 77, 77)", fontWeight: 600, borderWidth: 3, borderRadius: 10, fontSize: 19}} />
          </div>
        </form>
      </div>
    )
  }
}
