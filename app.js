var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var app = express()

//--------------------
// 
//  setting
//
//--------------------
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

//--------------------
// 
//  initial
//
//--------------------
app.listen(4000, () => {
    console.log('server listening on port 4000')
})



//--------------------
// 
//  router
//
//--------------------
const userRouter =  require('./router/usersRouter');
const postRouter =  require('./router/postRouter');



//--------------------
// 
//  routing
//
//--------------------
app.get('/', (req, res, next) => {
    return res.json({ message: 'Hi' })
})
app.use('/users', userRouter)
app.use('/posts', postRouter)

app.use((req, res, next) => {
    return res.status(400).send({ message: "400 bad request" })
});

module.exports = app;