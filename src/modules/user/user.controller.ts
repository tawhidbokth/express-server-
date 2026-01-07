import { Request, Response } from 'express';
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

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userservices.getUser();

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
};

const getSingleuser = async (req: Request, res: Response) => {
  try {
    const result = await userservices.getSingleuser(req.params.id!);
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
};

const getUpdateuser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await userservices.getUpdateuser(
      name,
      email,
      req.params.id!
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
};

const getDeleteuser = async (req: Request, res: Response) => {
  // console.log(req.params.id);
  try {
    const result = await userservices.getDeleteuser(req.params.id!);

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
};

export const userController = {
  createUser,
  getUser,
  getSingleuser,
  getUpdateuser,
  getDeleteuser,
};
