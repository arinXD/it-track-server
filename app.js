const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const session = require('express-session')

const mysql = require('mysql2/promise')
const { Sequelize, DataTypes } = require('sequelize')

const app = express()

//--------------------
// 
//  setting
//
//--------------------
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: [
        "http://localhost:4000",
        "http://localhost:3000",
        // "http://192.168.31.116:3000",
    ]
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
    // conn = await mysql.createConnection({
    //     host: '172.104.62.106',
    //     user: 'arincvaq_arin',
    //     password: '0847172849aB_',
    //     database: "arincvaq_it_track"
    // })
}
const sequelize = new Sequelize('it_track', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

const Acadyear = sequelize.define('acadyears', {
    acadyear: {
        type: DataTypes.INTEGER
    },
}, {
    paranoid: true, // Enable soft deletes
    timestamps: true, // Include timestamps (createdAt, updatedAt)
    underscored: true, // Use snake_case for column names
    deletedAt: 'deleted_at' // Custom name for the deletedAt column
});
app.listen(port, async () => {
    try {
        await initMySQL()
        // await sequelize.sync()
    } catch (err) {
        console.error(err);
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
const authRouter = require('./router/authRouter');
const studentRouter = require('./router/studentRouter');
const acadYearRouter = require('./router/acadYearRouter');

//--------------------
// 
//  middleware router
//
//--------------------
app.get('/', (req, res, next) => {
    return res.json({ message: 'IT Track by IT64' })
})
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/auth', authRouter)
app.use('/api/student', studentRouter)
app.use('/api/acadyear', acadYearRouter)

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