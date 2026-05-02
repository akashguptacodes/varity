const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'public', 'images');

async function convertAvifToJpg() {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.avif')) {
      const name = file.replace('.avif', '');
      const avifPath = path.join(dir, file);
      const jpgPath = path.join(dir, name + '.jpg');
      try {
        await sharp(avifPath).jpeg({ quality: 80 }).toFile(jpgPath);
        console.log(`Converted ${file} to JPG`);
        // Optional: delete avif
        fs.unlinkSync(avifPath);
      } catch (err) {
        console.error(`Failed to convert ${file}`, err);
      }
    }
  }
}

convertAvifToJpg();
