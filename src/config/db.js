import mysql from "mysql2/promise.js"

export const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: "",
    database: process.env.DATABASE
})


export default pool;