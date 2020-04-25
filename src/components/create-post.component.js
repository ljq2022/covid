import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
export default class CreatePost extends Component {
  constructor(props) {
    super(props);
    //ensures that the this called in the methods are the same this in the class
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onUploadFile = this.onUploadFile.bind(this);
    //state is how you create vars in react
    this.state = {
      username: '',
      description: '',
      date: new Date(),
      users: [],
      file: '',
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
          temporaryFileReader.readAsDataURL(inputFile);
        });
      };
      var binaryFile = await readUploadedFileAsText(e.target.files[0]).then((response) => {
        return response;
      });
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
      complete: false
    }
    console.log(post);
    axios.post('http://localhost:5000/posts/add', post)
      .then(res => console.log(res.data));
    this.setState({
      username: '',
      description: '',
      date: new Date(),
      users: [],
      file: '',
    })
  }

  render() {
    return (
    <div>
      <h3>Create New Post</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label>Username: </label>
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
          </select>
        </div>
        <div className="form-group">
          <label>Description: </label>
          <textarea type="text"
              required
              className="form-control"
              value={this.state.description}
              onChange={this.onChangeDescription}
              />
        </div>
        <div className="form-group">
          <label>Date: </label>
          <div>
            <DatePicker
              selected={this.state.date}
              onChange={this.onChangeDate}
              minDate={new Date()}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Image: </label>
          <div>
            <input type="file" className="form-control-file" onChange={this.onUploadFile}/>
          </div>
        </div>
        <div className="form-group">
          <input type="submit" value="Create Post" className="btn btn-primary" />
        </div>
      </form>
    </div>
    )
  }
}
