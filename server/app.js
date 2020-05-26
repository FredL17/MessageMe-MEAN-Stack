/* Import dependencies */
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const path = require('path');

/* Import models */
const Post = require('./models/post');

const app = express();
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};
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
});

/* Establish mongoDB connection */
mongoose.connect("mongodb+srv://Fred:Q1RhcvtEWVakoZuz@cluster0-goj9d.mongodb.net/MessageMe?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(() => {
    console.log("Connected to database!");
})
.catch((err) => {
    console.log("Database Connection failed!");
    console.log(err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("server/images")));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
    next();
});

/* Path for adding a new post */
app.post('/api/posts', multer({storage: storage}).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully.',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        });
    });
});

/* Path for fetching all existing posts */
app.get('/api/posts', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }

    postQuery
        .then(records => {
            fetchedPosts = records;
            return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: "Posts fetched successfully.",
                posts: fetchedPosts,
                maxPosts: count
            })
        });
});

/* Path for updating an existing post */
app.put("/api/post/:id", multer({storage: storage}).single("image"), (req, res, next) => {
    console.log("received request");
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.file.filename);
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    Post.updateOne({_id: req.params.id}, post).then(response => {
        console.log(response);
        res.status(200).json({message: 'Post updated successfully.', updatedPost: post});
    });
});

/* Path for deleting an existing post */
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