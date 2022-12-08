const express = require('express');
const app = express();
const dotenv = require('dotenv')

const databaseConnect = require('./config/database')
const authRouter = require('./routes/authRoute')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const messengerRoute = require('./routes/messengerRoute');
dotenv.config({
     path : 'backend/config/config.env' //help identifying the .env of the project
})
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/api/messenger',authRouter); //execute whatever is in authRoute.js 
// the /api/messenger is already declared in  frontend/src/store/actions/authAction.js
app.use('/api/messenger',messengerRoute);


const PORT = process.env.PORT || 5000 //get PORT from config/config.env
app.get('/', (req, res)=>{
     res.send('This is from backend Sever')
})

databaseConnect();

app.listen(PORT, ()=>{
     console.log(`Server is running on port ${PORT}`)
})