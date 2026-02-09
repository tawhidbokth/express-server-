import express, { Request, Response } from 'express';
import { userController } from './user.controller';
import logger from '../../middleware/logger';
import auth from '../../middleware/auth';
const router = express.Router();

router.post('/', userController.createUser);
router.get('/', logger, auth('admin'), userController.getUser);
router.get('/:id', userController.getSingleuser);
router.put('/:id', userController.getUpdateuser);
router.delete('/:id', userController.getDeleteuser);

export const userRoutes = router;
