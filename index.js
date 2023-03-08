const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;


app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(cookieParser());;
app.use(express.static(__dirname + "/public"));
app.use(require('./routes/router'));


mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true})
.then(()=>{
    console.log('Connected to DB');
    app.listen(PORT, ()=> console.log(`Server started on port: ${PORT} \nGo to http://127.0.0.1:${PORT}`));
})
.catch(error =>{
    console.log("An error Occured");
    console.log(error);
})