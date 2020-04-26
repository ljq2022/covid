import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../App.css"

const Post = props => (
  <tr style={{fontFamily: "sans-serif"}}>
    <td style={{fontWeight: 600}}>{props.post.username}</td>
    <td>{props.post.description}</td>
    <td>{props.post.date.substring(0,10)}</td>
    <td><img src={props.post.file} alt="" width="40" height="40" /></td>
    <td>{props.post.data}</td>
    <td>
      <div className="postRowActionDiv">
        <Link to={"/edit/"+props.post._id} style={{color: "rgb(255, 77, 77)"}}>✏️label</Link>
        <a href="#" onClick={() => { props.completePost(props.post._id) }} style={{color: "gray"}}>✅mark complete</a>
        <a href="#" onClick={() => { props.deletePost(props.post._id) }} style={{color: "gray"}}>🗑️delete</a>
      </div>
    </td>
  </tr>
)

//class component
export default class PostList extends Component {
  constructor(props) {
    super(props);

    this.completePost = this.completePost.bind(this)
    this.deletePost = this.deletePost.bind(this);
    this.filterPosts = this.filterPosts.bind(this)
    this.loadAllPosts = this.loadAllPosts.bind(this)
    this.importContacts = this.importContacts.bind(this)

    this.state = {
      filteredPosts: [],
    };
  }

  componentDidMount() {
    this.filterPosts(this.refs._filterSelection)
  }
  loadAllPosts(){
    axios.get('http://localhost:5000/posts/')
      .then(response => {
        this.setState({ filteredPosts: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }
  importContacts(){
    axios.get("http://localhost:5000/misc/importContacts").then(function(res){
      console.log(res)
      localStorage.setItem("contactsList", res)
    }).catch(function(error){
      console.log(error)
    })
  }
  deletePost(id) {
    axios.delete('http://localhost:5000/posts/'+id)
      .then(response => { console.log(response.data)});

      this.setState({
        filteredPosts: this.state.filteredPosts.filter(el => el._id !== id)
      })
  }
  completePost(id) {
    var completedPost;
    for(var i = 0; i < this.state.filteredPosts.length; i++) {
      if(this.state.filteredPosts[i]._id === id) {
        completedPost = this.state.filteredPosts[i];
        this.state.filteredPosts[i].complete = true;
        break;
      }
    }
    const res = {
      username: completedPost.username,
      description: completedPost.description,
      date: completedPost.date,
      file: completedPost.file,
      complete: true
    };
    axios.post('http://localhost:5000/posts/update/'+id, res)
      .then(response => { console.log(response.data)});
  }

  filterPosts(pickerSelection){
    if (pickerSelection.target == null){
      this.loadAllPosts()
      return
    }
    switch(pickerSelection.target.value){
      case "All Tasks":
        this.loadAllPosts()
        break

        case "Tasks Not Completed":
          axios.get("http://localhost:5000/posts/tasksNotCompleted").then(function(res){
            this.setState({filteredPosts: res.data})
          }.bind(this)).catch(function(error){
            console.log(error)
          })
          break

      case "Tasks Already Completed":
        axios.get("http://localhost:5000/posts/tasksAlreadyCompleted").then(function(res){
          this.setState({filteredPosts: res.data})
        }.bind(this)).catch(function(error){
          console.log(error)
        })
        break

      case "Tasks I Created":
        axios.get("http://localhost:5000/posts/tasksICreated").then(function(res){
          this.setState({filteredPosts: res.data})
        }.bind(this)).catch(function(error){
          console.log(error)
        })
        break

      case "Public Tasks":
        axios.get("http://localhost:5000/posts/public").then(function(res){
          this.setState({filteredPosts: res.data})
        }.bind(this)).catch(function(error){
          console.log(error)
        })
        break

      default:
        break
    }

  }

  postList() {
    return this.state.filteredPosts.map(currentpost => {
      console.log('POST LIST');
      console.log(currentpost);
      return <Post post={currentpost} completePost={this.completePost} deletePost={this.deletePost} key={currentpost._id}/>;
    })
  }

  render() {
    return (
      <div>
        <label style={{fontSize: 30, fontWeight: 600, textDecoration: "underline"}}>Posts</label>
        <button onClick={this.importContacts} style={{borderWidth: 3, borderColor: "gray", marginLeft: 20, backgroundColor: "white", color: "gray", borderRadius: 10, fontFamily: "sans-serif", paddingLeft: 11, paddingRight: 11, paddingTop: 3, paddingBottom: 3}}>👥Import Contacts</button>
        <br/>
        <select ref="_filterSelection" onChange={this.filterPosts} defaultValue={'All Tasks'} style={{marginBottom: 8}}>
          <option value='All Tasks'>All Tasks</option>
          <option value='Tasks Not Completed'>Tasks Not Completed</option>
          <option value='Tasks Already Completed'>Tasks Already Completed</option>
          <option value='Tasks I Created'>Tasks I Created</option>
          <option value='Public Tasks'>Public Tasks</option>
        </select>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Assigner</th>
              <th>Description</th>
              <th>Date</th>
              <th>File</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { this.postList() }
          </tbody>
        </table>
      </div>
    )
  }
}
