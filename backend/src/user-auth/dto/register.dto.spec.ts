import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  const valid = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    password: 'secret123',
    confirmPassword: 'secret123',
  };

  it('accepts matching password and confirmPassword', async () => {
    const dto = Object.assign(new RegisterDto(), valid);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects mismatched confirmPassword', async () => {
    const dto = Object.assign(new RegisterDto(), {
      ...valid,
      confirmPassword: 'different',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'confirmPassword')).toBe(true);
  });
});
