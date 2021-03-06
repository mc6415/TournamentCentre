var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html'),
    express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    controllers = require('./server/controllers/Namespace.js'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    multer = require('multer'),
    session = require('express-session'),
    MongoStore = require('connect-mongo/es5')(session);

// This is nasty I know. doing this checking app.settings.env didn't work
// and npm install was failing on node-sass on my AWS instance.
try{
  const sassMiddleware = require('node-sass-middleware');
  app.use(sassMiddleware({
    src: __dirname + '/public/sass',
    dest: __dirname + '/public/css',
    debug: true,
    outputStyle: 'compressed',
    prefix:'/css'
  }))
} catch(ex){

}

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', 'ENVIRONMENT IS ' + app.settings.env);
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var isLoggedIn = function(req){
  if(req.session.user) return true;

  return false;
}

function restrict(req,res,next){
  if(req.session.user){
    next();
  } else{
    res.send("No can do famz");
  }
}

function restrictAdmin(req,res,next){
  if(isLoggedIn && req.session.user.isAdmin == 1){
    next();
  } else {
    res.send("You seem to have taken a wrong turn there!");
  }
}

mongoose.connect('mongodb://sa:password@ds157320.mlab.com:57320/untilttournament');

// use pug for view engine and set the view directory.
app.set('view engine', 'pug');
app.set('views', __dirname + '/public/views');

// setup middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(session({
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  secret: "The line must be drawn here",
  resave: false
}))

// Setup shorthand static file locations
app.use('/', express.static(__dirname + '/public/views'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/img', express.static(__dirname + '/public/img'));

app.get('/', function(req,res){
  if(req.session.user){
    res.redirect('/dashboard')
  } else {
    res.render('index', {toast: false})
  }
});
app.post('/user/register', controllers.User.create)
app.post('/user/login', controllers.User.login)
app.post('/api/format/create', restrictAdmin, controllers.Admin.createFormat)
app.post('/api/tournament/create', restrictAdmin, controllers.Admin.createTournament);
app.get('/logout', restrict, controllers.User.logout)
app.get('/dashboard', restrict, controllers.User.home)
app.get('/formats', restrictAdmin, controllers.Admin.formats)
app.get('/tournaments', restrict, controllers.Admin.tournaments)

app.listen(port, function(){
  console.log("Server now listening on port " + port);
})
