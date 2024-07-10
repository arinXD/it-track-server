const csvtojson = require('csvtojson');
const mysql = require("mysql");
require("dotenv").config();
const { Subject } = require("./z/Subject")
const { Student } = require("./z/Student")
const { Enrollment } = require("./z/Enrollment")
const { StatusCode } = require("./z/StatusCode")
const subject = "./csv/subjects.csv";
const students = "./csv/studentdata.csv";
const enrollments = "./csv/student_course.csv";
const statusCodes = "./csv/status_code.csv";
const model = require("./models")
const { admins, programs, tracks } = require("./data")

const User = model.User
const Program = model.Program
const Track = model.Track

const hostname = process.env.DATABASE_HOST,
    username = process.env.DATABASE_USER,
    password = process.env.DATABASE_PASSWORD,
    databsename = process.env.DATABASE

let con = mysql.createConnection({
    host: hostname,
    user: username,
    password: password,
    database: databsename,
});

con.connect();

async function insertToDB(file, className, tableName) {
    try {
        const source = await csvtojson().fromFile(file);
        console.log("Inserting... " + tableName);
        let successfulInsertions = 0;
        for (let index = 0; index < source.length; index++) {
            const rowData = source[index];
            const obj = new className(rowData);
            const {
                insertStatement,
                items
            } = await obj.getInsertStatement();
            try {
                await new Promise((resolve, reject) => {
                    con.query(insertStatement, items, (err, results, fields) => {
                        if (err) {
                            reject(err);
                        } else {
                            successfulInsertions++;
                            resolve();
                        }
                    });
                });
            } catch (err) {
                continue
            }
            const percentage = ((index + 1) / source.length) * 100;
            process.stdout.write(percentage.toFixed(4) + "%\r")
        }
        console.log("\nDone");
    } catch (error) {
        console.error('Error converting CSV to JSON:', error.message);
        throw error;
    }
}

async function bulkCreate(model, data) {
    console.log("Inserting...",model.tableName )
    await model.bulkCreate(data);
    console.log("\nDone");
}

async function insertData() {
    try {
        await insertToDB(statusCodes, StatusCode, "StatusCode");
        await insertToDB(subject, Subject, "Subject");

        await bulkCreate(User, admins)
        await bulkCreate(Program, programs)
        await bulkCreate(Track, tracks)

        await insertToDB(students, Student, "Student");
        await insertToDB(enrollments, Enrollment, "Enrollment");
    } catch (err) {
        console.error(err);
    }
}

insertData();