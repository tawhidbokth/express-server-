import express, { Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';

const app = express();
const port = config.port;
// parser
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// database connection

initDB();

const loggerMiddleware = (req: Request, res: Response, next: Function) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
};

app.get('/', loggerMiddleware, (req: Request, res: Response) => {
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
    res.status(500).json({
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

// Get a single user by ID
app.get('/users/:id', async (req: Request, res: Response) => {
  // console.log(req.params.id);
  // res.send({
  //   message: 'API is cool',
  // });

  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);
    console.log(result.rows);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'user not found',
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'user succsesfully',
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// update user single by id

app.put('/users/:id', async (req: Request, res: Response) => {
  // console.log(req.params.id);
  // res.send({
  //   message: 'API is cool',
  // });

  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING * `,
      [name, email, req.params.id]
    );
    console.log(result.rows);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'user not found',
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'user update succsesfully',
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// delet user

app.delete('/users/:id', async (req: Request, res: Response) => {
  // console.log(req.params.id);
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// crate a todos

app.post('/todos', async (req: Request, res: Response) => {
  const { user_id, titel } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, titel) VALUES($1, $2) RETURNING *`,
      [user_id, titel]
    );
    res.status(201).json({
      success: true,
      message: 'Todo created',
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get('/todos', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);

    res.status(200).json({
      success: true,
      message: 'todos succsesfully reseved',
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

app.get('/todos/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos WHERE id = $1', [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// Update todo
app.put('/todos/:id', async (req, res) => {
  const { titel, completed } = req.body;

  try {
    const result = await pool.query(
      'UPDATE todos SET titel=$1, completed=$2 WHERE id=$3 RETURNING *',
      [titel, completed, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM todos WHERE id=$1 RETURNING *',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ success: true, message: 'Todo deleted', data: null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
