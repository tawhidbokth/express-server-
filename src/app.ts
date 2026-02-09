import express, { Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.routes';
import { todosRoutes } from './modules/todos/todos.routes';
import { authRoutes } from './modules/auth/auth.routes';

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
app.use('/todos', todosRoutes);
// auth routes
app.use('/auth', authRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

export default app;
