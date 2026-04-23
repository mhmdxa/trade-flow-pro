const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content
                .replace(/bg-white/g, 'bg-luxury-surface')
                .replace(/text-black/g, 'text-white')
                .replace(/text-gray-900/g, 'text-white')
                .replace(/dark:bg-gray-800/g, 'bg-luxury-surface')
                .replace(/dark:bg-gray-700/g, 'bg-luxury-elevated')
                .replace(/dark:text-white/g, 'text-white');
            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceInFiles('./src/app');
console.log("Done");
