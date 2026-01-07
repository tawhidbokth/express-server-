import { Request, Response } from 'express';
import { todosService } from './todos.service';

const createTodos = async (req: Request, res: Response) => {
  const { user_id, titel } = req.body;

  try {
    const result = await todosService.createTodos(user_id, titel);
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
};

export const todosController = {
  createTodos,
};
