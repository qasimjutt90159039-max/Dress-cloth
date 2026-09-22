const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🌸 Hand Embroidered Dresses Multan - Vercel Build Starting...');

const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');
const frontendDist = path.join(frontendDir, 'dist');
const rootDist = path.join(rootDir, 'dist');

try {
  // Step 1: Install frontend dependencies
  console.log('📦 Step 1: Installing frontend dependencies...');
  execSync('npm install --prefix frontend', {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });

  // Step 2: Build frontend with Vite
  console.log('⚡ Step 2: Building frontend with Vite...');
  execSync('npm run build --prefix frontend', {
    cwd: rootDir,
    stdio: 'inherit'
  });

  // Step 3: Mirror dist to root dist
  console.log('📁 Step 3: Mirroring build output...');
  if (fs.existsSync(frontendDist)) {
    if (!fs.existsSync(rootDist)) {
      fs.mkdirSync(rootDist, { recursive: true });
    }
    if (typeof fs.cpSync === 'function') {
      fs.cpSync(frontendDist, rootDist, { recursive: true });
    } else {
      copyFolderRecursiveSync(frontendDist, rootDist);
    }
    console.log('✓ Successfully mirrored build output to root dist/');
  } else {
    console.error('❌ Error: frontend/dist was not created by Vite build!');
    process.exit(1);
  }

  console.log('🎉 Vercel build completed successfully!');
} catch (error) {
  console.error('❌ Build failed with error:', error.message);
  process.exit(1);
}

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
  const files = fs.readdirSync(source);
  for (const file of files) {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}
