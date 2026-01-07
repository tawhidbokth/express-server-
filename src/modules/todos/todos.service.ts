import { pool } from '../../config/db';

const createTodos = async (user_id: number, titel: string) => {
  const result = await pool.query(
    `INSERT INTO todos(user_id, titel) VALUES($1, $2) RETURNING *`,
    [user_id, titel]
  );

  return result;
};

export const todosService = {
  createTodos,
};
