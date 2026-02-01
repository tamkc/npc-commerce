const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', '..', 'admin', 'out');
const dest = path.join(__dirname, '..', 'public');

if (!fs.existsSync(src)) {
  console.error('Admin build output not found at:', src);
  console.error('Run "npm run build" in the admin/ directory first.');
  process.exit(1);
}

if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true });
}

fs.cpSync(src, dest, { recursive: true });
console.log('Admin build copied to backend/public/');
