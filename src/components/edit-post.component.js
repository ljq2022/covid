import React, { Component } from 'react';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import LineChart from 'react-linechart'

export default class EditPost extends Component {
  constructor(props) {
    super(props);
    //ensures that the this called in the methods are the same this in the class
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeDiagnosis = this.onChangeDiagnosis.bind(this);
    //state is how you create vars in react
    this.state = {
      username: '',
      description: '',
      date: new Date(),
      file: '',
      positive: false
    }
  }
  componentDidMount() {
    console.log(this.props.match.params.id)
    axios.get('http://localhost:5000/posts/' + this.props.match.params.id)
      .then(response => {
        console.log(response.data)
        this.setState({
          username: response.data.username,
          description: response.data.description,
          date: new Date(response.data.date),
          file: response.data.file
        })
        
      })
    axios.get('http://localhost:5000/users/')
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            users: response.data.map(user => user.username),
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })

  }
  onChangeDiagnosis(e) {
    var res = false;
    if(e.target.value == 'Positive') {
      res = true;
    }
    this.setState({
      positive: res
    });
  }
  onSubmit(e) {
    e.preventDefault();

    const post = {
      username: this.state.username,
      description: this.state.description,
      date: this.state.date,
      file: this.state.file,
      complete: true,
      positive: this.state.positive
    }

    console.log(post);

    axios.post('http://localhost:5000/posts/update/' + this.props.match.params.id, post)
      .then(res => console.log(res.data));

    window.location = '/';
  }

  render() {
    return (
    <div>
      <h3>Label Image</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label>{this.state.username}'s Task</label>
        </div>
        <div className="form-group">
          <p>Instructions: {this.state.description}</p>
        </div>
        <div className="form-group">
          <label>Due Date: {String(this.state.date)}</label>
        </div>
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          <img src={this.state.file} alt=""/>
        </div>
        <div>
          <label>Result: </label>
          <select onChange={this.onChangeDiagnosis} defaultValue={'Negative'}>
            <option key='Positive' value='Positive'>Positive</option>
            <option key='Negative' value='Negative'>Negative</option>
          </select>
        </div>
        <div className="form-group">
          <input type="submit" value="Submit Task" className="btn btn-primary" />
        </div>
      </form>
    </div>
    )
  }
}
