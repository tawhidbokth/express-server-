import { Request, Response } from 'express';
import { todosService } from './todos.service';

const createTodos = async (req: Request, res: Response) => {
  try {
    const result = await todosService.createTodos(req.body);
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

const getTodos = async (req: Request, res: Response) => {
  try {
    const result = await todosService.getTodos();

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
};

const getsingleTodos = async (req: Request, res: Response) => {
  try {
    const result = await todosService.getsingleTodos(req.params.id!);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

const getupdateTodos = async (req: Request, res: Response) => {
  const { titel, completed } = req.body;

  try {
    const result = await todosService.getupdateTodos(
      titel,
      completed,
      req.params.id as string
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

const getdeleteTodos = async (req: Request, res: Response) => {
  try {
    const result = await todosService.getdeleteTodos(req.params.id!);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ success: true, message: 'Todo deleted', data: null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

export const todosController = {
  createTodos,
  getTodos,
  getsingleTodos,
  getupdateTodos,
  getdeleteTodos,
};
