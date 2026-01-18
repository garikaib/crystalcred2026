const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const testImage = '/var/www/next.crystalcred.co.zw/public/uploads/1768739963625-whatsapp-image-2022-03-10-at-7.22.59-pm.webp';

console.log(`Checking file: ${testImage}`);

if (!fs.existsSync(testImage)) {
    console.error('File does not exist!');
    process.exit(1);
}

const stats = fs.statSync(testImage);
console.log(`File size: ${stats.size} bytes`);

sharp(testImage)
    .resize(640)
    .webp({ quality: 75 })
    .toBuffer()
    .then(buffer => {
        console.log(`Success! Optimized buffer size: ${buffer.length} bytes`);
    })
    .catch(err => {
        console.error('Sharp error:', err);
        process.exit(1);
    });
