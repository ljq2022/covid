import React, { Component } from 'react';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Box = props => (
  <tr>
    <td>{props.box.index}</td>
    <td>({props.box.x}, {props.box.y})</td>
    <td>{props.box.height} x {props.box.width}</td>
    <td>
      <a href="#" onClick={() => { props.deletePost(props.box.index) }}>delete</a>
    </td>
  </tr>
)

export default class EditPost extends Component {
  constructor(props) {
    super(props);
    //ensures that the this called in the methods are the same this in the class
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeDiagnosis = this.onChangeDiagnosis.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.draw = this.draw.bind(this);
    this.createGraphData = this.createGraphData.bind(this)
    this.findGraphKeys = this.findGraphKeys.bind(this)
    this.randomColor = this.randomColor.bind(this)
    this.deleteBox = this.deleteBox.bind(this);
    //state is how you create vars in react
    this.state = {
      username: '',
      description: '',
      date: new Date(),
      file: '',
      positive: false,
      loading: true,
      beginX: 0,
      beginY: 0,
      data: '',
      lineKeys: [],
      boxes: []
    }
  }
  async deleteBox(index) {
    await this.setState({
      boxes: this.state.boxes.filter(el => el.index !== index)
    })
    console.log(this.state.boxes);
    this.draw()
    // const post = {
    //   username: this.state.username,
    //   description: this.state.description,
    //   date: this.state.date,
    //   file: this.state.file,
    //   complete: false,
    //   data: this.state.data,
    //   boxes: this.state.boxes
    // }
    // axios.post('http://localhost:5000/posts/'+id, post)
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
          lineKeys: response.data.data === "rtPCR" ? this.findGraphKeys(response.data.file) : [],
          boxes: response.data.boxes
        })
        if(response.data.data == 'CT-Scan') {
          this.setState({
            height: response.data.height,
            width: response.data.width
          });
          console.log(response.data.boxes);
        }
      })
  }
  onMouseDown(e) {
    var canvas = this.refs.canvas;
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    var context = canvas.getContext('2d');
    console.log(x);
    console.log(y);
    this.setState({beginX: x, beginY: y});
  }
  async onMouseUp(e) {
    var canvas = this.refs.canvas;
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    var context = canvas.getContext('2d');

    var res = [];
    for(var i = 0; i < this.state.boxes.length; i++) {
        var curr = this.state.boxes[i];
        console.log(curr);
        res.push({index: i,
          x: curr.x,
          y: curr.y,
          width: curr.width,
          height: curr.height});
    }
    await res.push({index: this.state.boxes.length,
      x: this.state.beginX,
      y: this.state.beginY,
      width: Math.abs(this.state.beginX - x),
      height: Math.abs(this.state.beginY - y)})
    await this.setState({boxes: res});
    console.log(this.state.boxes);
    this.draw();
  };
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
    console.log(this.state.boxes)
    const post = {
      username: this.state.username,
      description: this.state.description,
      date: this.state.date,
      file: this.state.file,
      complete: true,
      positive: this.state.positive,
      boxes: this.state.boxes
    }
    axios.post('http://localhost:5000/posts/update/' + this.props.match.params.id, post)
      .then(res => console.log(res.data));

    window.location = '/';
  }
  draw() {
    if(this.state.data === 'CT-Scan') {
      var canvas = this.refs.canvas;
      var context = canvas.getContext('2d');
      var imageObj = this.refs.image;
      imageObj.onload = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(imageObj, 0, 0);
      };
      imageObj.onload();
      for(var i = 0; i < this.state.boxes.length; i++) {
        var box = this.state.boxes[i];
        // the rectangle
        context.beginPath();
        context.rect(box.x, box.y, box.width, box.height);
        context.closePath();

        // the outline
        context.lineWidth = 3;
        context.strokeStyle = 'red';
        context.stroke();
      }
    }
  }
  boxList() {
    return this.state.boxes.map(currentbox => {
      return <Box box={currentbox} deletePost={this.deleteBox} key={currentbox.index}/>;
    })
  }
  boxTable() {
    return (
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Index</th>
            <th>Coordinates</th>
            <th>Dimensions</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{ this.boxList() }
      </tbody>
    </table>
    )
  }
  render() {
    this.draw()
    return (
    <div style={{fontFamily: "sans-serif"}}>
      <label style={{fontSize: 30, fontWeight: 600, textDecoration: "underline"}}>Label this image</label>
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label style={{fontSize: 20, color: "gray"}}>Task created by {this.state.username}</label>
        </div>
        <div className="form-group" style={{marginBottom: -6}}>
          <p>Description: {this.state.description}</p>
        </div>
        <div className="form-group">
          <label>Due Date: {String(this.state.date)}</label>
        </div>
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          {this.state.data === "rtPCR" ?
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
            <div onMouseMove={this.draw}>
              <canvas ref="canvas" height={this.state.height}
                width={this.state.width} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}
              />
              <img ref="image" src={this.state.file} style={{display: 'none'}} />
            </div>
          }
        </div>
        <hr/>
        <div>{this.state.data === "CT-Scan" && this.state.boxes.length > 0 ? this.boxTable(): <div />}</div>
        {(this.state.data === "CT-Scan" && this.state.boxes.length === 0) &&
          <label style={{paddingTop: 10}}>You have not drawn any boxes.</label>
        }
        <div style={{marginTop: 7}}>
          <label style={{fontWeight: 600}}>Result:</label>{" "}
          <select onChange={this.onChangeDiagnosis} defaultValue={'Negative'}>
            <option key='Positive' value='Positive'>Positive</option>
            <option key='Negative' value='Negative'>Negative</option>
          </select>
        </div>
        <div className="form-group" style={{marginTop: 23}}>
          <input type="submit" value="🤘Submit Task" style={{backgroundColor: "white", borderWidth: 0, paddingLeft: 8, paddingRight: 8, paddingBottom: 3, paddingTop: 3, borderColor: "rgb(255, 77, 77)", color: "rgb(255, 77, 77)", fontWeight: 600, borderWidth: 3, borderRadius: 10, fontSize: 19}} />
        </div>
      </form>
    </div>
    )
  }
}
