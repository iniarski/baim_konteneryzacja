import React, {Component } from 'react';
import axios from 'axios';
import PostForm from './components/PostForm';
import Post from './components/Post'

class App extends Component {
  state = {
    apiUrl: "http://localhost:4000",
    posts: []
  }

  handleUpdate = (e) => {
    this.setState({
        [e.target.id]: e.target.value
    })
}



  fetchPosts = () => {
    axios.get(`${this.state.apiUrl}/posts`)
      .then(res => this.setState( {posts : res.data} ))
      .catch(error => console.error('Error getting posts:', error))
  }

  componentDidMount() {
    this.fetchPosts()
  }

  render() {
    const {posts} = this.state
    const postList = posts.length ? (
      posts.map(post => {
        return(Post(post))
      })
    ) : (
      <div>No posts to show</div>
    );

    return(
    <div>
      <h1>World best posting service</h1>
      <PostForm apiUrl = {this.state.apiUrl} fetchPosts = {this.fetchPosts} />
      <form>
        <label>
          API URL:
          <input type="text" value={this.state.apiUrl} onChange={this.handleUpdate} id="apiUrl" required />
        </label>
      </form>
      <div>
      <button onClick={this.fetchPosts}>Refresh posts</button>
        {postList}
      </div>
    </div>
  )}
}

export default App;
