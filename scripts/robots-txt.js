const fs = require('fs').promises;

(async () => {
    await fs.copyFile('public/robots.txt', 'dist/robots.txt')
})()
