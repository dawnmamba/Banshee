import { buildJwtModuleOptions } from './jwt-module.options';

describe('buildJwtModuleOptions', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  it('reads JWT_EXPIRES_IN as ms-compatible expiresIn (BUG-001)', () => {
    const options = buildJwtModuleOptions();
    expect(options.signOptions?.expiresIn).toBe('1h');
    expect(options.secret).toBe('test-secret');
  });
});
