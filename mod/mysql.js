
//const conn=mysql.createConnection({host:"rest-tracker.mysql.database.azure.com", user:"azuredb", password:process.env.MYSQL_PASS, database:"autocheck", port:3306, ssl:{ca:fs.readFileSync("./../ssl/BaltimoreCyberTrustRoot.crt.pem")}});

// create the connection to database

const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

if (process.env.NODE_ENV !="production") {
    require('dotenv').config();
  }

const config =
{
    host: 'rest-tracker.mysql.database.azure.com',
    user: 'azuredb',
    password: process.env.MYSQL_PASS,
    database: 'rest-tracker',
    port: 3306,
    ssl: { ca: fs.readFileSync(path.join(__dirname, "DigiCertGlobalRootCA.crt.pem")) }
};

const conn = new mysql.createConnection(config);
connectionInit()
//handleDisconnect(conn);

function connectionInit() {
    return new Promise((resolve, reject) => {
        conn.connect(
            function (err) {
                if (err) {
                    console.log("SQL Error: Cannot connect!");
                    reject(err);
                }
                else {
                    console.log("SQL Connection established.");
                    resolve(true)
                }
            });
    })
}

function connectionEnd() {
    conn.end()
}

function handleDisconnect(connection) {
    connection.on('error', function(err) {
      if (!err.fatal) {
        return;
      }
  
      if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
        console.log(err);
      }
  
      console.log('Re-connecting lost connection: ' + err.stack);
  
      connection = mysql.createConnection(connection.config);
      handleDisconnect(connection);
      connection.connect();
    });
  }

  function customQuery(query) {
    return new Promise((resolve, reject) => {
        conn.query(query,
            function (err, dbres, fields) {
                if (err) return reject(err);
                return resolve(dbres);
            })
    })
};

function selectAll(tablename) {
    return new Promise((resolve, reject) => {
        conn.query(`Select * from  ${tablename};`,
            function (err, dbres, fields) {
                if (err) return reject(err);
                return resolve(dbres);
            })
    })
}

function selectAllPatientList() {
    return new Promise((resolve, reject) => {
        conn.query(`Select * from  patient_list order by lastname`,
            function (err, dbres, fields) {
                if (err) return reject(err);
                return resolve(dbres);
            })
    })
}
function findPatientByClinicAppId(clinic_id, app_id) {
    return new Promise((resolve, reject) => {
        conn.query('Select * from patient_list where clinic_id =? and app_id=?', [Number(clinic_id), app_id],
            function (err, dbres, fields) {
                if (err) return reject(err);
                return resolve(dbres);
            })
    })
};


function updatePatient(id, username) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE patient_list SET ';
        let updatefields = [];
        for (const key in username) {
           // if (isNaN(username[key])) {
                updatefields.push(`${key} = '${username[key]}'`)
            // } else {
            //     updatefields.push(`${key} = ${username[key]}`)
           // }
        }
        query = query + updatefields.join(",") + ' WHERE id = ' + Number(id)
        conn.query(query,
            function (err, dbres, fields) {
                if (err) return reject(err);
                return resolve(dbres);
            })
    })
};

function deletePatient(id) {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM patient_list WHERE id = ?;',
            [Number(id)],
            function (err, dbres, fields) {
                if (err) return reject(err);
                return resolve(dbres);
            })
    })
};



function selectAllWhere(tablename, where) {
    return new Promise((resolve, reject) => {
        conn.query(`Select * from  ${tablename} where ${where};`,
            function (err, dbres, fields) {
                console.log(err)
                if (err) return reject(err);
                return resolve(dbres);
            })
    })
}

function selectRingIdsWhere(fields, tablename, where) {
    return new Promise((resolve, reject) => {
        conn.query(`Select ${fields} from  ${tablename} where ${where};`,
            function (err, dbres, fields) {
                console.log(err)
                if (err) return reject(err);
                return resolve(dbres);
            })
    })
}

// conn.end(function (err) {
//         if (err) throw(err);
//         else console.log('done')
// });

// conn.end(function (err) {
//     return new Promise((resolve, reject) => {
//         if (err) reject(err);
//         else resolve('done')
//     })
// });

module.exports.customQuery = customQuery
module.exports.selectAll = selectAll
module.exports.selectAllWhere = selectAllWhere
module.exports.selectRingIdsWhere = selectRingIdsWhere
module.exports.selectAllPatientList = selectAllPatientList
module.exports.findPatientByClinicAppId = findPatientByClinicAppId
module.exports.updatePatient = updatePatient
module.exports.deletePatient = deletePatient




