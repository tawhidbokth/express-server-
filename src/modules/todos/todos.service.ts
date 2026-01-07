import { pool } from '../../config/db';

const createTodos = async (user_id: number, titel: string) => {
  const result = await pool.query(
    `INSERT INTO todos(user_id, titel) VALUES($1, $2) RETURNING *`,
    [user_id, titel]
  );

  return result;
};

const getTodos = async () => {
  const result = pool.query(`SELECT * FROM todos`);
  return result;
};

const getsingleTodos = async (id: string) => {
  const result = pool.query('SELECT * FROM todos WHERE id = $1', [id]);
  return result;
};

const getupdateTodos = async (
  titel: string,
  completed: boolean,
  id: string
) => {
  const result = await pool.query(
    'UPDATE todos SET titel=$1, completed=$2 WHERE id=$3 RETURNING *',
    [titel, completed, id]
  );
  return result;
};

const getdeleteTodos = async (id: string) => {
  const result = pool.query('DELETE FROM todos WHERE id=$1 RETURNING *', [id]);
  return result;
};

export const todosService = {
  createTodos,
  getTodos,
  getsingleTodos,
  getupdateTodos,
  getdeleteTodos,
};
