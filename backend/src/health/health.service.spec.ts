import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;
  let dataSource: {
    isInitialized: boolean;
    query: jest.Mock;
    initialize?: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      isInitialized: true,
      query: jest.fn(),
      initialize: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService, { provide: DataSource, useValue: dataSource }],
    }).compile();

    service = module.get(HealthService);
  });

  it('returns ok and database up when ping succeeds', async () => {
    dataSource.query.mockResolvedValue([{ '?column?': 1 }]);

    const result = await service.check();

    expect(result.status).toBe('ok');
    expect(result.database).toBe('up');
    expect(dataSource.query).toHaveBeenCalledWith('SELECT 1');
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });

  it('returns degraded and database down when ping fails', async () => {
    dataSource.query.mockRejectedValue(new Error('connection refused'));

    const result = await service.check();

    expect(result.status).toBe('degraded');
    expect(result.database).toBe('down');
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });

  it('returns degraded when initialize and ping fail', async () => {
    dataSource.isInitialized = false;
    dataSource.initialize = jest
      .fn()
      .mockRejectedValue(new Error('connection refused'));

    const result = await service.check();

    expect(result.status).toBe('degraded');
    expect(result.database).toBe('down');
    expect(dataSource.query).not.toHaveBeenCalled();
  });
});
