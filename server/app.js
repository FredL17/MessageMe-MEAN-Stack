const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://Fred:Q1RhcvtEWVakoZuz@cluster0-goj9d.mongodb.net/MessageMe?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(() => {
    console.log("Connected to database!");
})
.catch((err) => {
    console.log("Connection failed!");
    console.log(err);
});

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    
    post.save();
    console.log(post);
    res.status(201).json({
        message: 'Post added successfully.'
    });
    
});

app.get('/api/posts', (req, res, next) => {
    Post.find().then(records => {
        res.status(200).json({
            posts: records
        });
    });
    
});

module.exports = app;