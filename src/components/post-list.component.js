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

    this.state = {posts: []};
  }

  componentDidMount() {
    axios.get('http://localhost:5000/posts/')
      .then(response => {
        this.setState({ posts: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }
  deletePost(id) {
    axios.delete('http://localhost:5000/posts/'+id)
      .then(response => { console.log(response.data)});

    this.setState({
      posts: this.state.posts.filter(el => el._id !== id)
    })
  }
  completePost(id) {
    var completedPost;
    for(var i = 0; i < this.state.posts.length; i++) {
      if(this.state.posts[i]._id === id) {
        completedPost = this.state.posts[i];
        this.state.posts[i].complete = true;
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

  postList() {
    return this.state.posts.map(currentpost => {
      return <Post post={currentpost} completePost={this.completePost} deletePost={this.deletePost} key={currentpost._id}/>;
    })
  }

  render() {
    return (
      <div>
        <h3>Posts</h3>
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
