require("dotenv").config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const session = require('express-session')
const bodyParser = require('body-parser');
const expressWinston = require('express-winston')
const requestIp = require('request-ip');
const winstonLogger = require("./utils/logger");
const expressRateLimit = require("express-rate-limit")
const expressSlowDown = require("express-slow-down")
const { randomBytes } = require("crypto");
const { Sequelize, Op } = require('sequelize')
const app = express()

//-------------
// 
//  Initial
// 
//-------------

const limiter = expressRateLimit({
    windowMs: 1 * 60 * 1000,
    max: 1000,
    message: "Too many requests, try again later."
})

const speedLimiter = expressSlowDown({
    windowMs: 1 * 60 * 1000,
    delayAfter: 50,
    delayMs: () => 500,
})

app.use(cors({
    credentials: true,
    origin: [
        "https://it-track-client.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
    ]
}))
app.use(requestIp.mw()); // extract ip 
app.use(expressWinston.logger({
    winstonInstance: winstonLogger,
    statusLevels: true,
    meta: true, // meta data about the request
    expressFormat: false,
    colorize: false,
    dynamicMeta: (req, res) => {
        return {
            ip: req.clientIp,
        };
    }
}));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(logger('dev'));
app.use(session({
    name: "it-track",
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 6 * 60 * 60 * 1000,
        secure: false
    },
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(limiter)
app.use(speedLimiter)

const port = 4000
const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    logging: false,
    dialect: 'mysql',
    timezone: '+07:00',
},
)

// CRON JOB 
require('./cron-noti');

app.listen(port, async () => {
    try {
        await sequelize.sync()
    } catch (err) {
        console.error(err);
        console.log("!!!!WARNING!!!!");
        console.log(` - Check database connection`);
    } finally {
        console.log(`Server is listening on port ${port}`)
    }
})

//-------------------------------
// 
//  Import router && middleware
//
//-------------------------------
const userRouter = require('./router/usersRouter');
const authRouter = require('./router/authRouter');
const studentRouter = require('./router/studentRouter');
const trackRouter = require('./router/trackRouter');
const trackSelectionRouter = require('./router/trackSelectionRouter');
const enrollmentRouter = require('./router/enrollmentRouter');
const studentStatusRouter = require('./router/studentStatusRouter');
const trackSubjectRouter = require('./router/trackSubjectRouter');
const teacherTrackRouter = require('./router/teacherTrackRouter');
const advisorRouter = require('./router/advisorRouter');
const careerRouter = require('./router/careerRouter');
const suggestionFormRouter = require('./router/suggestionFormRouter');
const questionBankRouter = require('./router/questionBankRouter');
const assessmentRouter = require('./router/assessmentRouter');
const petitionRouter = require('./router/petitionRouter');
const selectionRouter = require('./router/selectionRouter');
const newsRouter = require('./router/newsRouter');
const notificationRouter = require('./router/notificationRouter');

//  subject router
const subjectRouter = require('./router/subjectRouter');
const categoryRouter = require('./router/categoryRouter');
const groupRouter = require('./router/groupRouter');
const subGroupRouter = require('./router/subGroupRouter');
const semiSubGroupRouter = require('./router/semiSubGroupRouter');

//  program router
const programRouter = require('./router/programRouter')
const programCodeRouter = require('./router/programCodeRouter')

//  verify router
const verifyRouter = require('./router/verifyRouter')
const verifySelectionRouter = require('./router/verifySelectionRouter');
const conditionVerifyRouter = require('./router/conditionVerifyRouter')
const verifySelectionTeacherRouter = require('./router/verifySelectionTeacherRouter')

// middleware
const isAuth = require("./middleware/authMiddleware")
const isAdmin = require("./middleware/adminMiddleware");

//--------------------
// 
//  middleware router
//
//--------------------

app.get('/', async (req, res, next) => {
    const IPAddress =
        req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress || '';
    const publicIP = req.publicIP
    return res.json({
        message: 'IT Track by IT64',
        IPAddress,
    })
})
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/students', studentRouter)
app.use('/api/students/enrollments', enrollmentRouter)
app.use('/api/tracks', trackRouter)
app.use('/api/tracks/subjects', isAdmin, trackSubjectRouter)
app.use('/api/tracks/selects', trackSelectionRouter)
app.use('/api/subjects', subjectRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/groups', groupRouter);
app.use('/api/subgroups', subGroupRouter);
app.use('/api/semisubgroups', semiSubGroupRouter);
app.use('/api/programs', programRouter);
app.use('/api/programcodes', programCodeRouter);
app.use('/api/verify', verifyRouter);
app.use('/api/verify/selects', verifySelectionRouter);
app.use('/api/verifies/approve', verifySelectionTeacherRouter);
app.use('/api/condition', conditionVerifyRouter);
app.use('/api/statuses', isAdmin, studentStatusRouter);
app.use('/api/teachers/tracks', teacherTrackRouter)
app.use('/api/advisors', advisorRouter)
app.use('/api/careers', careerRouter)
app.use('/api/suggestion-forms', suggestionFormRouter)
app.use('/api/questions', questionBankRouter)
app.use('/api/assessments', assessmentRouter)
app.use('/api/petitions', petitionRouter)
app.use('/api/selections', selectionRouter)
app.use('/api/news', newsRouter)
app.use('/api/notifications', notificationRouter)

app.get("/api/get-token", async (req, res) => {
    const token = randomBytes(16).toString("hex")
    res.cookie("XSRF-TOKEN", token)
    res.locals.csrfToken = token
    try {
        return res.status(200).json({
            ok: true,
            message: "ping",
            "x-xsrf-token": token
        })
    } catch (err) {
        return res.status(500).json({
            message: "server error"
        })
    }
})
app.get("/api/validate", async (req, res) => {
    const token = req.cookies["XSRF-TOKEN"]
    const header = req.headers["x-xsrf-token"]
    if (token !== header) {
        return res.status(403).json({
            message: "Invalid CSRF token"
        })
    }
    try {
        return res.status(200).json({
            ok: true,
            message: "pong"
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