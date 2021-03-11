//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const encryption = require("mongoose-encryption");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encryption, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
})

app.get("/login", function(req, res){
  res.render("login");
})

app.get("/register", function(req, res){
  res.render("register");
})

app.post("/register", function(req, res){

  User.findOne({email: req.body.username}, function(err, docs){
    if(docs){
      res.render("login");
    } else {
      const newUser = new User({
        email: req.body.username,
        password: req.body.password
      });

      newUser.save(function(err){
        if(err){
          console.log(err);
        }  else {
          res.render("secrets");
        }
      });
    }
  })

})

app.post("/login", function(req, res){

  User.findOne({email: req.body.username}, function(err, docs){
    if(docs){
      if(docs.password === req.body.password){
        res.render("secrets");
      } else {
        console.log("The password is incorrect!!!");
        res.render("login");
      }
    } else {
      res.render("register");
    }
  });

})







app.listen("3000", function(){
  console.log("server is running on port 3000");
})
