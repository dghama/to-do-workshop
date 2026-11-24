import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const environmentFiles = {
  dev: '.env',
  test: '.env.test',
  staging: '.env.staging',
  prod: '.env.production',
} as const;
const actions = ['start', 'rebuild', 'stop', 'migrate', 'test', 'config'] as const;

type Environment = keyof typeof environmentFiles;
type Action = (typeof actions)[number];

function printUsage(): void {
  console.log(`Usage: pnpm run env -- <dev|test|staging|prod> <${actions.join('|')}>`);
  console.log('');
  console.log('Actions:');
  console.log('  start    Start PostgreSQL, API, and web services after health checks');
  console.log('  rebuild  Rebuild images, then start the services');
  console.log('  stop     Stop and remove containers without removing database volumes');
  console.log('  migrate  Apply committed Prisma migrations with migrate deploy');
  console.log('  test     Run the Docker API test profile');
  console.log('  config   Validate the selected Compose configuration without starting services');
  console.log('');
  console.log('Environment files: .env, .env.test, .env.staging, and .env.production.');
  console.log('Create the selected file locally and provide secrets through a secure local store.');
}

function runCompose(envFile: string, environment: Environment, args: string[]): void {
  const result = spawnSync(
    'docker',
    ['compose', '--env-file', envFile, '-f', 'docker-compose.yml', ...args],
    {
      cwd: rootDirectory,
      env: {
        ...process.env,
        NODE_ENV:
          environment === 'prod'
            ? 'production'
            : environment === 'dev'
              ? 'development'
              : environment,
      },
      stdio: 'inherit',
    },
  );

  if (result.error) {
    throw new Error(`Could not run Docker Compose: ${result.error.message}`, {
      cause: result.error,
    });
  }

  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  }
}

function main(argv: string[]): void {
  const args = argv[0] === '--' ? argv.slice(1) : argv;
  const [environmentArgument, actionArgument = 'start', ...extraArguments] = args;

  if (
    environmentArgument === undefined ||
    environmentArgument === '--help' ||
    environmentArgument === '-h'
  ) {
    printUsage();
    return;
  }

  if (!Object.hasOwn(environmentFiles, environmentArgument)) {
    throw new Error(
      `Unknown environment "${environmentArgument}". Choose dev, test, staging, or prod.`,
    );
  }

  if (!actions.includes(actionArgument as Action)) {
    throw new Error(`Unknown action "${actionArgument}". Choose ${actions.join(', ')}.`);
  }

  if (extraArguments.length > 0) {
    throw new Error('Unexpected extra arguments.');
  }

  const environment = environmentArgument as Environment;
  const action = actionArgument as Action;
  const envFile = environmentFiles[environment];
  const envPath = resolve(rootDirectory, envFile);
  if (!existsSync(envPath)) {
    throw new Error(
      `Missing ${envFile}. Create it locally and set the environment values before continuing.`,
    );
  }

  const compose = (...composeArgs: string[]) => runCompose(envPath, environment, composeArgs);

  switch (action) {
    case 'start':
      compose('up', '-d', '--wait');
      break;
    case 'rebuild':
      compose('up', '--build', '-d', '--wait');
      break;
    case 'stop':
      compose('down');
      break;
    case 'migrate':
      compose('run', '--rm', 'api', 'pnpm', '--filter', '@todo/api', 'db:migrate');
      break;
    case 'test':
      if (environment !== 'test') {
        throw new Error('The Docker test profile can only be run with the test environment.');
      }
      compose('--profile', 'test', 'run', '--build', '--rm', 'api-tests');
      break;
    case 'config':
      compose('config', '--quiet');
      break;
  }
}

try {
  main(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
