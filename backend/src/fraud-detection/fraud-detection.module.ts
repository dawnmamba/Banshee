import { Module } from '@nestjs/common';
import { FraudDetectionService } from './fraud-detection.service';
import { GeminiService } from './gemini.service';

@Module({
  providers: [FraudDetectionService, GeminiService],
  exports: [FraudDetectionService],
})
export class FraudDetectionModule {}
