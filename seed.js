const csvtojson = require('csvtojson');
const mysql = require("mysql");
require("dotenv").config();

const subject = "./csv/subjects.csv";
const students = "./csv/studentdata.csv";
const enrollments = "./csv/student_course.csv";
const statusCodes = "./csv/status_code.csv";

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

const { Subject } = require("./z/Subject")
const { Student } = require("./z/Student")
const { Enrollment } = require("./z/Enrollment")
const { StatusCode } = require("./z/StatusCode")

async function insertToDB(file, className) {
    try {
        const source = await csvtojson().fromFile(file);
        console.log("Inserting...");
        let successfulInsertions = 0;
        for (let index = 0; index < source.length; index++) {
            const rowData = source[index];
            const obj = new className(rowData);
            const { insertStatement, items } = obj.getInsertStatement();
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
            process.stdout.write(percentage.toFixed(4)+"%\r")
        }
        console.log("\nDone");
    } catch (error) {
        console.error('Error converting CSV to JSON:', error.message);
        throw error;
    }
}

async function insertData() {
    try {
        // await insertToDB(statusCodes, StatusCode);
        // await insertToDB(subject, Subject);
        await insertToDB(students, Student);
        await insertToDB(enrollments, Enrollment);
    } catch (err) {
        console.error(err);
    }
}

insertData();