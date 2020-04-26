import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Post = props => (
  <tr>
    <td>{props.post.username}</td>
    <td>{props.post.description}</td>
    <td>{props.post.date.substring(0,10)}</td>
    <td><img src={props.post.file} alt="" width="40" height="40" /></td>
    <td>{props.post.data}</td>
    <td>
      <Link to={"/edit/"+props.post._id}>label</Link> | <a href="#" onClick={() => { props.completePost(props.post._id) }}>mark complete</a>
      <br/>
      <a href="#" onClick={() => { props.deletePost(props.post._id) }}>delete</a>
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

    this.state = {
      filteredPosts: []
    };
  }

  componentDidMount() {
    this.filterPosts(this.refs._filterSelection.target == null ? "" : this.refs._filterSelection.target.value)
  }
  deletePost(id) {
    axios.delete('http://localhost:5000/posts/'+id)
      .then(response => { console.log(response.data)});

    this.filterPosts(this.refs._filterSelection.target.value)
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

  filterPosts(pickerSelectionValue){
    switch(pickerSelectionValue){
      case "All Tasks":
        axios.get("http://localhost:5000/posts").then(function(res){
          this.setState({filteredPosts: res.data})
        }.bind(this)).catch(function(error){
          console.log(error)
        })
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
        axios.get("http://localhost:5000/posts/publicTasks").then(function(res){
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
        <h3>Posts</h3>
        <select ref="_filterSelection" onChange={this.filterPosts} defaultValue={'All Tasks'}>
          <option value='All Tasks'>All Tasks</option>
          <option value='Tasks Not Completed'>Tasks Not Completed</option>
          <option value='Tasks Already Completed'>Tasks Already Completed</option>
          <option value='Tasks I Created'>Tasks I Created</option>
          <option value='Public Tasks'>Public Tasks</option>
        </select>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Username</th>
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
