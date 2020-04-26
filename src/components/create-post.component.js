import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../App.css"
export default class CreatePost extends Component {
  constructor(props) {
    super(props);
    //ensures that the this called in the methods are the same this in the class
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onUploadFile = this.onUploadFile.bind(this);
    this.onChangeData = this.onChangeData.bind(this);
    //state is how you create vars in react
    this.state = {
      username: '',
      description: '',
      date: new Date(),
      users: [],
      file: '',
      data: 'Image'
    }
  }
  componentDidMount() {
    axios.get('http://localhost:5000/users/')
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            users: response.data.map(user => user.username),
            username: response.data[0].username
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })

  }
  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    })
  }
  onChangeData(e) {
    this.setState({
      data: e.target.value
    });
    console.log(e.target.value);
  }
  onChangeDate(date) {
    this.setState({
      date: date
    })
  }
  async onUploadFile(e) {
    const readUploadedFileAsText = (inputFile) => {
      const temporaryFileReader = new FileReader();
        return new Promise((resolve, reject) => {
          temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
          };

          temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result);
          };
          if (inputFile.name.split(".")[1] !== "csv"){
            temporaryFileReader.readAsDataURL(inputFile);
          }else{
            resolve(inputFile.name)
          }
        });
      };
      var binaryFile = await readUploadedFileAsText(e.target.files[0]).then((response) => {
        return response;
      });
      if(binaryFile.includes('image')) {
        var height = 0;
        var width = 0;
        const addImageProcess = (src) => {
          return new Promise((resolve, reject) => {
            let img = new Image()
            img.onload = () => {
              height = img.naturalHeight;
              width = img.naturalWidth;
              resolve([height, width]);
            }
            img.onerror = reject
            img.src = src
          })
        }
        var dims = await addImageProcess(binaryFile).then((response) => {
          return response;
        });
        this.setState({
          height: dims[0],
          width: dims[1]
        })
      }
      this.setState({
        file: binaryFile
      });
  }

  onSubmit(e) {
    e.preventDefault();
    const post = {
      username: this.state.username,
      description: this.state.description,
      date: this.state.date,
      file: this.state.file,
      complete: false,
      data: this.state.data
    }
    if(this.state.data == 'Image') {
      post.height = this.state.height;
      post.width = this.state.width;
    }
    console.log(post);
    axios.post('http://localhost:5000/posts/add', post)
      .then(res => console.log(res.data));
    window.location = '/';
  }

  render() {
    return (
    <div>
      <label style={{fontSize: 30, fontWeight: 600, textDecoration: "underline"}}>Create New Post</label>
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label>Assigner: Luke Qin</label>
        </div>
        <div className="form-group">
          <label className="newPostHeadings">Username: </label>
          <select ref="userInput"
              required
              className="form-control"
              value={this.state.username}
              onChange={this.onChangeUsername}>
              {
                this.state.users.map(function(user) {
                  return <option
                    key={user}
                    value={user}>{user}
                    </option>;
                })
              }
              <option value='Public'>Public</option>
          </select>
        </div>
        <div className="form-group">
          <label className="newPostHeadings">Description: </label>
          <textarea type="text"
              required
              className="form-control"
              value={this.state.description}
              onChange={this.onChangeDescription}
              placeholder="What should someone know about this file?"
              />
        </div>
        <div className="form-group">
          <label className="newPostHeadings">Date: </label>
          <div>
            <DatePicker
              selected={this.state.date}
              onChange={this.onChangeDate}
              minDate={new Date()}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="newPostHeadings">Data Type: </label>
          <div>
            <select onChange={this.onChangeData} defaultValue={'Image'}>
              <option key='Image' value='Image'>CT-Scan</option>
              <option key='PCR' value='PCR'>rtPCR</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="newPostHeadings">File: </label>
          <div style={{fontWeight: 550}}>
            <input type="file" className="form-control-file" onChange={this.onUploadFile}/>
          </div>
        </div>
        <div className="form-group">
          <input type="submit" value="🙌 Create Post" style={{backgroundColor: "white", borderWidth: 0, paddingLeft: 8, paddingRight: 8, paddingBottom: 3, paddingTop: 3, borderColor: "rgb(255, 77, 77)", color: "rgb(255, 77, 77)", fontWeight: 600, borderWidth: 3, borderRadius: 10, fontSize: 19}} />
        </div>
      </form>
    </div>
    )
  }
}
