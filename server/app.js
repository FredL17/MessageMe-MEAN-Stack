/* Import dependencies */
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');

const postsRoutes = require('./routes/posts');

const path = require('path');

const app = express();

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

app.use(postsRoutes);

module.exports = app;