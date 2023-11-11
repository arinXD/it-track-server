const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const mysql = require('mysql2/promise')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const session = require('express-session')

const app = express()

//--------------------
// 
//  setting
//
//--------------------
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:4000"]
}))
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))
app.use(express.static(path.join(__dirname, 'public')))

//--------------------
// 
//  initial
//
//--------------------
const port = 4000
global.conn = null
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: "it_track"
    })
}
app.listen(port, async () => {
    try {
        await initMySQL()
    } catch (err) {
        console.log("!!!!WARNING!!!!");
        console.log(` - Check database connection`);
    } finally {
        console.log(`Server listening on port ${port}`)
    }
})

//--------------------
// 
//  import router
//
//--------------------
const userRouter = require('./router/usersRouter');
const postRouter = require('./router/postRouter');
const studentAuthRouter = require('./router/studentAuthRouter');

//--------------------
// 
//  middleware router
//
//--------------------
app.get('/', (req, res, next) => {
    return res.json({ message: 'Hi' })
})
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/auth/student', studentAuthRouter)

app.get("/api/test", async (req, res) => {
    try {
        return res.status(200).json({
            ok: true,
            data: [{
                id: 1,
                ping: "pong"
            }],
        })
    } catch (err) {
        return res.status(500).json({ message: "server error" })
    }
})

app.use((req, res, next) => {
    return res.status(400).json({ message: "400 bad request" })
});

module.exports = app;