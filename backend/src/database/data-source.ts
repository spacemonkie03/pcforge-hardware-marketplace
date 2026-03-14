import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';

const port = Number(process.env.DB_PORT || 5432);

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port,
  username: process.env.DB_USER || 'pc_user',
  password: process.env.DB_PASS || 'pc_pass',
  database: process.env.DB_NAME || 'pc_hardware',
  synchronize: false,
  migrationsRun: false,
  logging: false,
  entities: [join(__dirname, '..', '**', '*.entity.{js,ts}')],
  migrations: [join(__dirname, 'migrations', '*{.js,.ts}')],
});
