import { todosController } from './todos.controller';
import express from 'express';
const router = express.Router();

router.post('/', todosController.createTodos);
router.get('/', todosController.getTodos);
router.get('/:id', todosController.getsingleTodos);
router.put('/:id', todosController.getupdateTodos);
router.delete('/:id', todosController.getdeleteTodos);

export const todosRoutes = router;
