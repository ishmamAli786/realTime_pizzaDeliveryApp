require('dotenv').config();
const express=require("express");
const app=express();
const ejs=require('ejs');
const path=require('path');
const expressLayout=require('express-ejs-layouts');
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('express-flash');
const MongoDbStore = require('connect-mongo')(session);
const passport=require('passport');
const Emitter=require('events')
const PORT = process.env.PORT || 3000;
/// DataBase Connection
mongoose.connect('mongodb://localhost:27017/pizza', { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true,useFindAndModify:true });
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("DataBase Connected");
}).catch(err=>{
    console.log("connection failed");
})



/// Session Store
let mongoStore=new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions',
})

/// Event Emitter
const eventEmitter=new Emitter()
app.set('eventEmitter',eventEmitter)

/// Session Config
/// session is a middleware and for use any middleware of express we can app.use function
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 100*60*60*24}, /// 24 hours
    
}))

//// Passport Config
const passportInit = require('./app/config/passport');
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(express.urlencoded({extended: false}))
app.use(express.json())
//// Global MiddleWare
app.use((req,res,next)=>{
    res.locals.session = req.session;
    res.locals.user=req.user
    next();
})



app.use(flash())

///// Assets 
app.use(express.static('public'));




///// Set Template Engine
app.use(expressLayout);
app.set('views', path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');



require('./routes/web')(app);

const server=app.listen(PORT,()=>{
    console.log(`Server Is Running On Port ${PORT}....`);
})


/// Socket
const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})