import { readFileSync } from 'fs';
import { join } from 'path';

describe('database CLI npm scripts', () => {
  const packageJson = JSON.parse(
    readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8'),
  ) as { scripts: Record<string, string> };

  it('runs TypeORM via node and ts-node (Windows-compatible)', () => {
    const typeormScript = packageJson.scripts.typeorm;

    expect(typeormScript).not.toContain('typeorm-ts-node-commonjs');
    expect(typeormScript).toMatch(/node -r ts-node\/register/);
    expect(typeormScript).toContain('./node_modules/typeorm/cli.js');
    expect(typeormScript).toContain('-d src/database/data-source.ts');
  });
});
