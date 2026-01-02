import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const config = {
  port: process.env.PORT || 5000,
  connectionString: process.env.CONECTION_STR,
};

export default config;
