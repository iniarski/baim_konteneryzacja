const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
const PORT = 4000;

// Sample data: list of posts
let posts = [
  { id: 1, title: 'Post 1', content: 'This is the content of Post 1.' },
  { id: 2, title: 'Post 2', content: 'This is the content of Post 2.' },
];

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.use(cors())

// Endpoint to get all posts
app.get('/posts', (req, res) => {
  res.json(posts);
});

// Endpoint to add a new post
app.post('/posts', (req, res) => {
  const { title, content } = req.body;

  // Simple validation
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  // Generate a new post object
  const newPost = {
    id: posts.length + 1,
    title,
    content,
  };

  // Add the new post to the posts array
  posts.push(newPost);

  res.status(201).json(newPost);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
