import express, { Request, Response } from 'express';
import { userController } from './user.controller';
const router = express.Router();

router.post('/', userController.createUser);
router.get('/', userController.getUser);
router.get('/:id', userController.getSingleuser);
router.put('/:id', userController.getUpdateuser);
router.delete('/:id', userController.getDeleteuser);

export const userRoutes = router;
