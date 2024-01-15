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
    <div className='blue-grey lighten-1 white-text'>
      <nav><div className="nav-wrapper grey darken-2"><div className='brand-logo'>World best posting service</div></div></nav>
      <div className="center container">
      <PostForm apiUrl = {this.state.apiUrl} fetchPosts = {this.fetchPosts} />
      <div className="container">
      <form>
        <label>
          API URL:
          <input type="text" value={this.state.apiUrl} onChange={this.handleUpdate} id="apiUrl" required className='indigo lighten-4'/>
        </label>
      </form>
      </div>
      <div>
      <button onClick={this.fetchPosts} className='btn-large light-blue'>Refresh posts</button>
        <div className="row">{postList}</div>
      </div>
      </div>
    </div>
  )}
}

export default App;
