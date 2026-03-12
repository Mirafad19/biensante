const fs = require('fs');
const path = require('path');

const assetsDir = '/app/applet/src/assets';
const files = fs.readdirSync(assetsDir);

let totalSize = 0;
for (const file of files) {
  if (file.endsWith('.jpg') || file.endsWith('.png')) {
    const size = fs.statSync(path.join(assetsDir, file)).size;
    console.log(`${file}: ${size} bytes`);
    totalSize += size;
  }
}
console.log(`Total size: ${totalSize} bytes`);
