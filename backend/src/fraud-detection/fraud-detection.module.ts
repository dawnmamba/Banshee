import { Module } from '@nestjs/common';
import { AzureAiFoundryService } from './azure-ai-foundry.service';
import { FraudDetectionService } from './fraud-detection.service';

@Module({
  providers: [FraudDetectionService, AzureAiFoundryService],
  exports: [FraudDetectionService],
})
export class FraudDetectionModule {}
