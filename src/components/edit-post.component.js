import React, { Component } from 'react';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default class EditPost extends Component {
  constructor(props) {
    super(props);
    //ensures that the this called in the methods are the same this in the class
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeDiagnosis = this.onChangeDiagnosis.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.draw = this.draw.bind(this);
    this.createGraphData = this.createGraphData.bind(this)
    this.findGraphKeys = this.findGraphKeys.bind(this)
    this.randomColor = this.randomColor.bind(this)
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
      rect: {},
      data: '',
      lineKeys: []
    }
  }

  createGraphData(jsonDataStr){
    var cleanedString = jsonDataStr.replace(/\'/gi,'')
    var jsonData = JSON.parse(cleanedString)
    return jsonData
  }

  findGraphKeys(jsonDataStr){
    var cleanedString = jsonDataStr.replace(/\'/gi,'')
    var jsonData = JSON.parse(cleanedString)
    var lineKeysTemp = []
    for (var key of Object.keys(jsonData[0])){
      lineKeysTemp.push(key)
    }
    return lineKeysTemp
  }

  randomColor(){
    const red = Math.random() * 230
    const green = Math.random() * 230
    const blue = Math.random() * 230
    return "rgb(" + red + "," + green + "," + blue + ")"
  }

  componentDidMount() {
    axios.get('http://localhost:5000/posts/' + this.props.match.params.id)
      .then(response => {
        this.setState({
          username: response.data.username,
          description: response.data.description,
          date: new Date(response.data.date),
          file: response.data.file,
          data: response.data.data,
          lineKeys: response.data.data === "PCR" ? this.findGraphKeys(response.data.file) : []
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
          {this.state.data === "PCR" ?
            <LineChart 
              width={500} 
              height={300} 
              data={this.createGraphData(this.state.file)}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0,45]}/>
              <Tooltip />
              <Legend />
              {this.state.lineKeys.map(label => 
                <Line key={label} type="monotone" dataKey={label} stroke={label === "Water" ? "rgb(20,20,20)" : this.randomColor()} />
              )}
            </LineChart>
          :
            <div>
              <canvas ref="canvas" height={this.state.height}
                width={this.state.width} onMouseDown={this.onMouseDown} onMouseMove={() => {console.log('penis')}}
              />
              <img ref="image" src={this.state.file} style={{display: 'none'}} />
            </div>
          }
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
