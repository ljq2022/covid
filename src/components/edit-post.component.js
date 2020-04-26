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
    this.onMouseDown = this.onMouseDown.bind(this);
    this.draw = this.draw.bind(this);
    //state is how you create vars in react
    this.state = {
      username: '',
      description: '',
      date: new Date(),
      file: '',
      positive: false,
      loading: true,
      width: 0,
      height: 0,
      beginX: 0,
      beginY: 0,
      rect: {}
    }
  }
  componentDidMount() {
    axios.get('http://localhost:5000/posts/' + this.props.match.params.id)
      .then(response => {
        this.setState({
          username: response.data.username,
          description: response.data.description,
          date: new Date(response.data.date),
          file: response.data.file,
          data: response.data.data
        })
        if(response.data.data == 'Image') {
          this.setState({
            height: response.data.height,
            width: response.data.width
          });
        }
      })
  }
  onMouseDown(e) {
    var canvas = this.refs.canvas;
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    var context = canvas.getContext('2d');
    // the rectangle
    context.beginPath();
    context.rect(x, y, x, y);
    context.closePath();

    // the outline
    context.lineWidth = 3;
    context.strokeStyle = '#666666';
    context.stroke();
  }
  onMouseMove(e) {

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

    axios.post('http://localhost:5000/posts/update/' + this.props.match.params.id, post)
      .then(res => console.log(res.data));

    window.location = '/';
  }
  draw(startX, startY, drawing) {
    if(this.state.data == 'Image') {
      var canvas = this.refs.canvas;
      var context = canvas.getContext('2d');
      var imageObj = this.refs.image;
      imageObj.onload = function() {
        context.drawImage(imageObj, 0, 0);
      };
    }
  }
  render() {
    this.draw()
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
          <canvas ref="canvas" height={this.state.height}
          width={this.state.width} onMouseDown={this.onMouseDown} onMouseMove={() => {console.log('penis')}}
          />
          <img ref="image" src={this.state.file} style={{display: 'none'}} />
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
