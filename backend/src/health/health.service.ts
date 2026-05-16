import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

export type HealthStatus = 'ok' | 'degraded';
export type DatabaseStatus = 'up' | 'down';

export interface HealthCheckResult {
  status: HealthStatus;
  timestamp: string;
  database: DatabaseStatus;
}

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  async check(): Promise<HealthCheckResult> {
    const database = await this.pingDatabase();

    return {
      status: database === 'up' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      database,
    };
  }

  private async pingDatabase(): Promise<DatabaseStatus> {
    if (!this.dataSource.isInitialized) {
      try {
        await this.dataSource.initialize();
      } catch {
        return 'down';
      }
    }

    try {
      await this.dataSource.query('SELECT 1');
      return 'up';
    } catch {
      return 'down';
    }
  }
}
