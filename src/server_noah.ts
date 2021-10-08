import express, { Application, Request, Response } from 'express'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(express.json());

( async () => {

    // TO DO: GET CONNECTION WITH MONGO AND INFLUX
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT!) || 3306,
        user: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'examen2021'
    })

    await connection.query('CREATE TABLE IF NOT EXISTS photos(id int auto_increment primary key, url varchar(1024) not null, title varchar(255) default null, time timestamp not null default current_timestamp());')

    // -------------------------------- GET --------------------------------

    app.get('/', async (request: Request, response: Response) => {
        console.log("GET request was succesfull!")
        console.log(response)
    })

app.listen(42069, () => {
    console.log("Listing on port 42069")
})

console.log('*** Server started ***')
})