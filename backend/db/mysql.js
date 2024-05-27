import { createConnection } from 'mysql'
import 'dotenv/config'

const dbconfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
}

const connection = createConnection(dbconfig)

connection.connect((error) => {
  if (error) {
    console.error('Error al conectar con la base de datos:', error);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL'); 
})

export default connection