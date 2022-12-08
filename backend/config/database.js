const mongoose = require('mongoose');

const databaseConnect = () => {
     mongoose.connect(process.env.DATABASE_URL,{ //Get Database URL in config.env thanks to dotenv package defined in server.js
          useNewUrlParser : true,
          useUnifiedTopology : true
     }).then(()=>{
          console.log('Mongodb Database Connected')
     }).catch(error=>{
          console.log(error)
     })
}
module.exports = databaseConnect; 