import 'dotenv/config';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './database.config';

export default new DataSource(getDatabaseConfig());
