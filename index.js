const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000

require('dotenv').config();

// Using Node.js `require()`
const mongoose = require('mongoose');
const {Schema} = mongoose;

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@m201-haa.q45gn.mongodb.net/netflix-api-db-dev?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const User = mongoose.model('Users', new mongoose.Schema(
    {name: String,
    email: {  type: String, 
              required: true,
              unique:true},
    password:{  type:String,
                required: true}
    }
  ))


app.use(cors, (req, res, next)=>{
  res.header("Access-Control-Allow-Origin", "*") //update the domain you will use. The * means that all domains can access to this API
  // res.header("Access-Control-Allow-Origin", "www.google.com") //This allows only google.com domain to execute the API. 

  next();
})


// Parse JSON bodies for this app. Make sure you put
// `app.use(express.json())` **before** your route handlers!
app.use(express.json());

// const bp = require('body-parser')
// app.use(bp.json())
// app.use(bp.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  res.send('Hello World!... Humberto Asca')
})

app.post('/register', (req, res) => {
  // res.status(200).send("Registered yahoo!")
  const newUser = new User ({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  newUser.save((err, user) =>{
    if (err) {
      console.log(err);
      res.status(400).send({status: err})
    }
    else {
      console.log("All is good");
      console.log(user);
      res.send("New user register");
    }
  });
})

app.get('/login', (req, res)=> {
  res.send("Login Page Valid xxx");
})

app.post('/login', (req, res)=> {
  // let xdata = req.body;
  // console.log("Mi data samplezzz", xdata);
  const password = req.body.password;
  const email = req.body.email;
  // const validUser = {
  //   email: "humbertoasca@hotmail.com",
  //   password: "1234"
  // }
  User.findOne({email: email, password: password}, (err, user)=> {
    if (user) {
      res.status(200).send({
        status: "User Valid"
      })  
    } else {
      res.status(404).send( {
        status: "Not found"
      })      
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
