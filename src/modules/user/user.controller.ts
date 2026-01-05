import { Request, Response } from 'express';
import { pool } from '../../config/db';
import { userservices } from './user.service';

const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await userservices.createUser(name, email);

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
};

export const userController = {
  createUser,
};
