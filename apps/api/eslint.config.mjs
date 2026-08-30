import tseslint from 'typescript-eslint';
import nestjsConfig from '@tonti/eslint-config/nestjs';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  ...nestjsConfig,
);
