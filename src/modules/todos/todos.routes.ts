import { todosController } from './todos.controller';
import express from 'express';
const router = express.Router();

router.post('/', todosController.createTodos);

export const todosRoutes = router;
