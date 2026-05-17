import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from './user-role';
import { RolesGuard } from './roles.guard';
describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const createContext = (user: { role: UserRole } | undefined) =>
    ({
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('allows user role when user is required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.User]);

    expect(
      guard.canActivate(
        createContext({
          role: UserRole.User,
          id: '1',
          email: 'u@b.com',
          firstName: 'U',
          lastName: 'Ser',
        }),
      ),
    ).toBe(true);
  });

  it('denies admin on user-only route', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.User]);

    expect(() =>
      guard.canActivate(
        createContext({
          role: UserRole.Admin,
          id: '1',
          email: 'a@b.com',
          firstName: 'A',
          lastName: 'Dmin',
        }),
      ),
    ).toThrow(ForbiddenException);
  });

  it('allows when no roles metadata', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    expect(guard.canActivate(createContext(undefined))).toBe(true);
  });
});
