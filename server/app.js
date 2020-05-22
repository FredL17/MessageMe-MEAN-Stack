const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const Post = require('./models/post');

const app = express();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid) {
            error = null;
        }
        cb(null, "server/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    },
})

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
    next();
});

app.post('/api/posts', multer({storage: storage}).single("image"), (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully.',
            postId: createdPost._id
        });
    })
  
});

app.get('/api/posts', (req, res, next) => {
    Post.find().then(records => {
        res.status(200).json({
            posts: records
        });
    });
    
});

app.put("/api/post/:id", (req, res, next) => {
    console.log("received request");
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post).then(response => {
        console.log(response);
        res.status(200).json({message: 'Post updated successfully.'});
    })
})

app.delete("/api/post/:id", (req, res, next) => {
    const postId = req.params.id;
    console.log(postId);
    Post.deleteOne({_id: postId}).then(response => {
        console.log(response);
        res.status(202).json({
            message: 'Deleted post successfully.'
        });
    });
});

module.exports = app;