#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const directories = [
  'backend/src/config',
  'backend/src/modules/auth/application',
  'backend/src/modules/auth/domain',
  'backend/src/modules/auth/infrastructure/models',
  'backend/src/modules/auth/infrastructure/repositories',
  'backend/src/modules/auth/presentation/controllers',
  'backend/src/modules/auth/presentation/routes',
  'backend/src/modules/auth/presentation/validators',
  'backend/src/modules/issues/application',
  'backend/src/modules/issues/domain',
  'backend/src/modules/issues/infrastructure/models',
  'backend/src/modules/issues/infrastructure/repositories',
  'backend/src/modules/issues/presentation/controllers',
  'backend/src/modules/issues/presentation/routes',
  'backend/src/modules/issues/presentation/validators',
  'backend/src/modules/sync/application',
  'backend/src/modules/sync/domain',
  'backend/src/modules/sync/infrastructure/repositories',
  'backend/src/modules/sync/presentation/controllers',
  'backend/src/modules/sync/presentation/routes',
  'backend/src/modules/users/application',
  'backend/src/modules/users/domain',
  'backend/src/modules/users/infrastructure/models',
  'backend/src/modules/users/infrastructure/repositories',
  'backend/src/modules/users/presentation/controllers',
  'backend/src/modules/users/presentation/routes',
  'backend/src/modules/users/presentation/validators',
  'backend/src/middleware',
  'backend/src/shared/errors',
  'backend/src/shared/logging',
  'backend/src/shared/utils',
  'backend/src/app',
  'backend/tests/integration',
  'backend/tests/unit',
  'backend/scripts',
  'frontend/public',
  'frontend/src/app/providers',
  'frontend/src/app/routes',
  'frontend/src/assets',
  'frontend/src/components/layout',
  'frontend/src/components/ui',
  'frontend/src/features/auth/components',
  'frontend/src/features/auth/hooks',
  'frontend/src/features/auth/pages',
  'frontend/src/features/issues/components',
  'frontend/src/features/issues/hooks',
  'frontend/src/features/issues/pages',
  'frontend/src/features/sync/components',
  'frontend/src/features/sync/hooks',
  'frontend/src/features/users/components',
  'frontend/src/features/users/pages',
  'frontend/src/db/indexeddb/migrations',
  'frontend/src/db/indexeddb/repositories',
  'frontend/src/db/indexeddb/schemas',
  'frontend/src/db/repositories',
  'frontend/src/hooks',
  'frontend/src/services/api',
  'frontend/src/state',
  'frontend/src/sync/queue',
  'frontend/src/sync/strategies',
  'frontend/src/types',
  'frontend/src/utils',
  'frontend/tests/e2e',
  'frontend/tests/unit',
  'frontend/scripts',
];

for (const relativePath of directories) {
  const directoryPath = path.resolve(__dirname, relativePath);
  fs.mkdirSync(directoryPath, { recursive: true });

  const keepFilePath = path.join(directoryPath, '.gitkeep');
  if (!fs.existsSync(keepFilePath)) {
    fs.writeFileSync(keepFilePath, '');
  }
}