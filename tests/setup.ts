import { execSync } from 'child_process';

export default () => {
  try {
    execSync('npm run test-db:drop');
  } catch (err) {
    // It is fine, in that case db with test name just doesn't exist
  }

  execSync('npm run test-db:create');
};
