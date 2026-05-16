import { BadRequestException } from '@nestjs/common';
import { WelcomeMessageService } from './welcome-message.service';

describe('WelcomeMessageService', () => {
  let service: WelcomeMessageService;

  beforeEach(() => {
    service = new WelcomeMessageService();
  });

  describe('buildMessage', () => {
    it('returns welcome message with full name', () => {
      expect(service.buildMessage('Jane', 'Doe')).toBe('Welcome, Jane Doe');
    });

    it('trims whitespace from names', () => {
      expect(service.buildMessage('  Jane  ', '  Doe  ')).toBe(
        'Welcome, Jane Doe',
      );
    });

    it('throws when first name is empty after trim', () => {
      expect(() => service.buildMessage('  ', 'Doe')).toThrow(
        BadRequestException,
      );
    });

    it('throws when last name is empty after trim', () => {
      expect(() => service.buildMessage('Jane', '')).toThrow(
        BadRequestException,
      );
    });
  });
});
