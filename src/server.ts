import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });
const app = express();
const port = 5000;
// parser
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// database connection
const pool = new Pool({
  connectionString: `${process.env.CONECTION_STR}`,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) NOT NULL UNIQUE,
     age INT, 
     phone VARCHAR(15), 
     address TEXT, 
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
  )
`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos  (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    titel VARCHAR(200) NOT NULL, 
    description TEXT, 
    completed BOOLEAN DEFAULT false, 
    due_date DATE, 
    created_at TIMESTAMP DEFAULT NOW(), 
    updated_at TIMESTAMP DEFAULT NOW () 
    )
    
    
    `);
};

initDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! tawhid here');
});

// Create a new user

app.post('/users', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
      [name, email]
    );

    res.send({
      success: true,
      data: result.rows[0],
    });
  } catch (err: any) {
    return res.status(500).json({
      succces: false,
      message: err.message,
    });
  }
});

// Get all users
app.get('/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);

    res.status(200).json({
      success: true,
      message: 'user succsesfully reseved',
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
