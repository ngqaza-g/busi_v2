const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const spawn = require("child_process").spawn;
const create_admin = require('./modules/create_admin');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;


app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(cookieParser());;
app.use(express.static(__dirname + "/public"));
app.use(require('./routes/router'));


mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true})
.then(async ()=>{
    console.log('Connected to DB');
    await create_admin();
    const pythonProcess = spawn('python',["app.py"]);
    require('./modules/mqttClient');
    app.listen(PORT, ()=> console.log(`Server started on port: ${PORT} \nGo to http://127.0.0.1:${PORT}`));
})
.catch(error =>{
    console.log("An error Occured");
    console.log(error);
})