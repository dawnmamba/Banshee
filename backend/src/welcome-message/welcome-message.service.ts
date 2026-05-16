import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class WelcomeMessageService {
  buildMessage(firstName: string, lastName: string): string {
    const first = firstName.trim();
    const last = lastName.trim();

    if (!first || !last) {
      throw new BadRequestException('First name and last name are required');
    }

    return `Welcome, ${first} ${last}`;
  }
}
