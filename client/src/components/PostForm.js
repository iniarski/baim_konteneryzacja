import React, { Component } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

class PostForm extends Component {

    state = {
        title: '',
        content: '',
    }

    handleUpdate = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state)
        const sanitizedTitle = DOMPurify.sanitize(this.state.title)
        const sanitizedContent = DOMPurify.sanitize(this.state.content)
    
        // Send a new post to the API
        axios.post(`${this.props.apiUrl}/posts`, { title : sanitizedTitle, content : sanitizedContent })
          .then(response => {
            this.setState({
                title: '',
                content: ''
            })
          })
          .catch(error => console.error('Error adding post:', error));

          this.props.fetchPosts()
      };

    render() {
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
            <h3>Add New Post</h3>
              <label>
                Title:
                <input type="text" value={this.state.title} onChange={this.handleUpdate} id="title" required className='indigo lighten-4'/>
              </label>
              <br />
              <label>
                Content:
                <textarea value={this.state.content} onChange={this.handleUpdate} id="content" required className='indigo lighten-4'/>
              </label>
              <br />
              <button type="submit" className='btn light-blue'>Add Post</button>
            </form>
          </div>
        )
    }
}

export default PostForm;


