import mysql from 'mysql2';

const database = mysql.createPool({
    host: '127.0.0.1',
    user: 'Oran',
    port: 3306,
    password: 'Newyork130417',
    database: 'freshfeast'
}).promise();

export default database;