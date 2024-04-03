const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const session = require('express-session')
const {
    Sequelize
} = require('sequelize')
require("dotenv").config();
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
        "https://it-track-client.vercel.app",
        "http://localhost:3000",
    ]
}))
app.use(cookieParser());
app.use(express.urlencoded({
    extended: false
}));
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
const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD, {
        host: process.env.DATABASE_HOST,
        dialect: 'mysql',
        logging: false,
        timezone: '+07:00',
    },
)

app.listen(port, async () => {
    try {
        await sequelize.sync()
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
//  import router && middleware
//
//--------------------
const userRouter = require('./router/usersRouter');
const postRouter = require('./router/postRouter');
const authRouter = require('./router/authRouter');
const studentRouter = require('./router/studentRouter');
const acadYearRouter = require('./router/acadYearRouter');
const adminRouter = require('./router/adminRouter');
const trackRouter = require('./router/trackRouter');
const trackSelectionRouter = require('./router/trackSelectionRouter');
const enrollmentRouter = require('./router/enrollmentRouter');
const studentStatusRouter = require('./router/studentStatusRouter');

// const studentDataRouter = require('./router/studentDataRouter');
const adminMiddleware = require("./middleware/adminMiddleware")

//--------------------
// 
//  subject router
//
//--------------------

const subjectRouter = require('./router/subjectRouter');
const categoryRouter = require('./router/categoryRouter');
const groupRouter = require('./router/groupRouter');
const subGroupRouter = require('./router/subGroupRouter');

//--------------------
// 
//  program router
//
//--------------------

const programRouter = require('./router/programRouter')
const programCodeRouter = require('./router/programCodeRouter')

//--------------------
// 
//  middleware router
//
//--------------------
const a = [{sxd:10}]
app.get('/', (req, res, next) => {
    return res.json({
        message: 'IT Track by IT64',
        data: a
    })
})
app.use('/api/admin', adminRouter)
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/auth', authRouter)
app.use('/api/students', studentRouter)
app.use('/api/students/enrollments', enrollmentRouter)
app.use('/api/acadyear', adminMiddleware, acadYearRouter)
app.use('/api/tracks', trackRouter)
app.use('/api/tracks/selects', trackSelectionRouter)
app.use('/api/subjects', subjectRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/groups', groupRouter);
app.use('/api/subgroups', subGroupRouter);
app.use('/api/programs', programRouter);
app.use('/api/programcodes', programCodeRouter);
app.use('/api/statuses', adminMiddleware, studentStatusRouter);

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
        return res.status(500).json({
            message: "server error"
        })
    }
})

app.use((req, res, next) => {
    return res.status(400).json({
        message: "400 bad request"
    })
});

module.exports = app;