const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, 'frontend', 'dist');
const destDir = path.resolve(__dirname, 'dist');

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

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

try {
  if (fs.existsSync(srcDir)) {
    if (typeof fs.cpSync === 'function') {
      fs.mkdirSync(destDir, { recursive: true });
      fs.cpSync(srcDir, destDir, { recursive: true });
    } else {
      copyFolderRecursiveSync(srcDir, destDir);
    }
    console.log('✓ Successfully mirrored frontend/dist to root dist/ for Vercel deployment');
  } else {
    console.warn('! Notice: frontend/dist was not found to copy');
  }
} catch (err) {
  console.error('Error copying dist:', err.message);
}
