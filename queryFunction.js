const csvtojson = require('csvtojson');
const mysql = require("mysql");
require("dotenv").config();

function insertToDB(file, className) {
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

    con.connect((err) => {
        if (err) return console.error(
            'error: ' + err.message);
        console.log("Connect to DB");
    });

    csvtojson()
        .fromFile(file)
        .then((source) => {
            const promises = source.map((rowData, index) => {
                return new Promise((resolve, reject) => {
                    const obj = new className(rowData);
                    const {
                        insertStatement,
                        items
                    } = obj.getInsertStatement();

                    con.query(insertStatement, items, (err, results, fields) => {
                        if (err) {
                            // Continue with the next record in case of an error
                            console.error(`skip ${index + 1}: ${err}`);
                            reject(err);
                        } else {
                            console.log(`Item at row ${index + 1} inserted successfully`);
                            resolve();
                        }
                    });
                });
            });

            Promise.all(promises)
                .then(() => {
                    console.log('All items stored into the database successfully');
                })
                .catch((error) => {
                    console.log(error);
                    return
                });
        })
        .catch((error) => {
            console.error('Error converting CSV to JSON:', error.message);
        });
}

module.exports = {
    insertToDB
};