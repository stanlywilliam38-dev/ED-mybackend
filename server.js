const express = require("express")
const mongoose = require('mongoose')
const app = express();

const passport = require('passport');
const bodyParser = require('body-parser');

const CONST = require('./src/config/const');
const { DB_URL, DB_NAME, PORT } = CONST;

app.get("/",(req, res) => {
    res.json({name:"jhon"})
})

app.get('/public/:name', (req, res) => {
  var options = {
  root: __dirname + '/public/img/uploads',
  // dotfiles: 'deny',
  // headers: {
  //     'x-timestamp': Date.now(),
  //     'x-sent': true
  // }
};
  // console.log('options = ', options);
  // console.log(req.params.name);
var fileName = req.params.name;
res.sendFile(fileName, options, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Sent:', fileName);
  }
});

})



// Passport Config
require('./src/config/passport')(passport);
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// /api/*에 관한 routes를 돌려준다.
const routes = require('./src/router');
app.use('/api', routes);

//MongoDB와의 접속을 진행한다.
try {
  mongoose.connect(DB_URL + DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch(e) {
  console.log(e);
}

const chatServer = require('./lib/chat_server');
const server = require('http').createServer(app);
chatServer.listen(server);

const Port = PORT; //PORT 설정
server.listen(Port, () => {
    console.log(`Server is running on port ${Port}`)
})