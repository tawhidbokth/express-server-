import express, { Request, Response } from 'express';
import { pool } from '../../config/db';
const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
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

router.get('/', async (req: Request, res: Response) => {
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

export const userRoutes = router;
