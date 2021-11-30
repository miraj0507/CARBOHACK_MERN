const express = require("express");
const app = express();
const bodyParser= require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const indexRoute = require("./routes/indexRoute");
const path = require("path");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect('mongodb+srv://miraj:miraj123@cluster0.2ftvv.mongodb.net/carbohack?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err)); 



app.use('/',indexRoute);



app.listen("3000", () =>{
    console.log("Backend is running.");
});
  