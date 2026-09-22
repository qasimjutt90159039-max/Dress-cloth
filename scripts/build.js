import { execSync } from 'child_process';

console.log('Building Hand Embroidered Dresses Frontend...');
try {
  execSync('npm --prefix frontend install && npm --prefix frontend run build', { stdio: 'inherit' });
  console.log('Build completed successfully.');
} catch (err) {
  console.error('Build error:', err);
  process.exit(1);
}
