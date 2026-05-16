import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthService: { check: jest.Mock };

  beforeEach(async () => {
    healthService = {
      check: jest.fn().mockResolvedValue({
        status: 'ok',
        timestamp: '2026-05-16T12:00:00.000Z',
        database: 'up',
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: HealthService, useValue: healthService }],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  describe('check', () => {
    it('returns service result with status, timestamp, and database', async () => {
      const result = await healthController.check();

      expect(healthService.check).toHaveBeenCalled();
      expect(result).toEqual({
        status: 'ok',
        timestamp: '2026-05-16T12:00:00.000Z',
        database: 'up',
      });
    });
  });
});
