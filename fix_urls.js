import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    // We use $$ to escape the $ in the replacement string so it outputs as a single $
    let replaced = content.replace(/http:\/\/\$\{window\.location\.hostname\}:5000/g, "$${import.meta.env.VITE_API_URL || 'http://localhost:5000'}");
    if (content !== replaced) {
      fs.writeFileSync(filePath, replaced);
      console.log('Updated:', filePath);
    }
  }
});
