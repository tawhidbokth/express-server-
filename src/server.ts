import express, { Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.routes';
import { userservices } from './modules/user/user.service';
import { todosRoutes } from './modules/todos/todos.routes';

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

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
