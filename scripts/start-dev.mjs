import { spawn } from 'node:child_process';

const run = (name, command, args) => {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe',
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  child.stdout.on('data', (data) => process.stdout.write(`[${name}] ${data}`));
  child.stderr.on('data', (data) => process.stderr.write(`[${name}] ${data}`));
  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
    }
  });

  return child;
};

const server = run('server', 'node', ['server.js']);
const client = run('client', 'npm.cmd', ['run', 'dev:client']);

const stop = () => {
  server.kill();
  client.kill();
  process.exit();
};

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
