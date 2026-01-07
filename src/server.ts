import express, { Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.routes';
import { userservices } from './modules/user/user.service';

const app = express();
const port = config.port;
// parser
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// database connection
initDB();

app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello World! tawhid here');
});

// user routes

app.use('/users', userRoutes);

// todo routes

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
