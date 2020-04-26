import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/navbar.component";

import PostList from "./components/post-list.component";
import CreateUser from "./components/create-user.component";
import CreatePost from "./components/create-post.component";
import EditPost from "./components/edit-post.component"
import Painterro from 'painterro'

class App extends React.Component{
  constructor(props){
    super(props)
    this.updateNavBar = this.updateNavBar.bind(this)
    this.state = {
      updateNum: 0
    }
  }
  updateNavBar(){
    console.log("updatdkjf")
    this.setState({updateNum: this.state.updateNum+1})
  }
  render(){
    return (
      <Router>
        <div style={{marginLeft: 35, marginRight: 35, marginTop: 20}}>
          <Navbar id={this.state.updateNum}/>
          <hr />
          <Route path="/" exact component={PostList} />
          <Route path="/create" component={CreatePost} />
          <Route path="/user" render={() => <CreateUser updateNavBar={this.updateNavBar}/>} />
          <Route path="/edit/:id" component={EditPost} />
        </div>
      </Router>
    );
  }
}

export default App;
