import {
  Global,
  Injectable,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './database.config';

@Injectable()
class DataSourceShutdown implements OnApplicationShutdown {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationShutdown(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }
}

export async function createDataSource(): Promise<DataSource> {
  const dataSource = new DataSource({
    ...getDatabaseConfig(),
    password: String(process.env.DB_PASSWORD ?? ''),
  });

  try {
    await dataSource.initialize();
  } catch {
    // App boots without DB; health reports degraded until reachable.
  }

  return dataSource;
}

@Global()
@Module({
  providers: [
    {
      provide: DataSource,
      useFactory: createDataSource,
    },
    DataSourceShutdown,
  ],
  exports: [DataSource],
})
export class DatabaseModule {}
