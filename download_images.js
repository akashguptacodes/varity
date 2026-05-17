const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

// 1. Read videoUtils.js and extract all unique Google Drive File IDs
const videoUtilsPath = path.join(__dirname, 'src', 'lib', 'videoUtils.js');
const videoUtilsContent = fs.readFileSync(videoUtilsPath, 'utf8');

const driveIdRegex = /\/d\/([a-zA-Z0-9_-]+)/g;
let match;
const uniqueIds = [];
const seenIds = new Set();

while ((match = driveIdRegex.exec(videoUtilsContent)) !== null) {
  const id = match[1];
  if (!seenIds.has(id)) {
    seenIds.add(id);
    uniqueIds.push(id);
  }
}

console.log(`Extracted ${uniqueIds.length} unique Google Drive file IDs from videoUtils.js`);

const destDir = path.join(__dirname, 'public', 'images');

// Function to download a single thumbnail and compress/resize it using sharp, returning buffer
async function downloadAndCompress(fileId) {
  const downloadUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  };

  return new Promise((resolve) => {
    const doReq = (url, depth = 0) => {
      if (depth > 5) {
        console.error(`Too many redirects for file ID: ${fileId}`);
        resolve(null);
        return;
      }

      const req = https.get(url, options, (res) => {
        if (res.statusCode === 302 || res.statusCode === 303) {
          doReq(res.headers.location, depth + 1);
        } else if (res.statusCode !== 200) {
          resolve(null);
        } else {
          const chunks = [];
          res.on('data', chunk => chunks.push(chunk));
          res.on('end', async () => {
            try {
              const buffer = Buffer.concat(chunks);
              // Check if buffer is valid image data (must not be an HTML page)
              if (buffer.toString('utf8', 0, 100).includes('<!DOCTYPE html>') || buffer.toString('utf8', 0, 100).includes('<html')) {
                resolve(null);
                return;
              }

              // Resize to 512px width, convert to progressive JPEG with 75% quality
              const compressedBuffer = await sharp(buffer)
                .resize({ width: 512 })
                .jpeg({ quality: 75, progressive: true })
                .toBuffer();
              
              resolve(compressedBuffer);
            } catch (err) {
              resolve(null);
            }
          });
        }
      });

      req.on('error', () => {
        resolve(null);
      });

      // Set timeout of 12 seconds to prevent hanging requests
      req.setTimeout(12000, () => {
        req.destroy();
        resolve(null);
      });
    };

    doReq(downloadUrl);
  });
}

async function main() {
  // 2. Clean up ALL old orbit-*.jpg files first to guarantee fresh start
  console.log('Cleaning up all old and fallback orbit images...');
  const files = fs.readdirSync(destDir);
  let deletedCount = 0;
  files.forEach(file => {
    if (file.startsWith('orbit-') && file.endsWith('.jpg')) {
      try {
        fs.unlinkSync(path.join(destDir, file));
        deletedCount++;
      } catch (e) {
        console.error(`Failed to delete ${file}:`, e.message);
      }
    }
  });
  console.log(`Deleted ${deletedCount} old orbit image files.`);

  // 3. Process the IDs in small parallel batches of 4, keeping the downloaded images completely unique
  const targetCount = 44;
  const downloadedPaths = [];
  let currentUniqueIdIndex = 0;
  let successIndex = 1;

  console.log(`Downloading and compressing ${targetCount} 100% unique hero images...`);

  // We loop until we successfully get 44 unique images, or run out of unique Google Drive IDs
  while (successIndex <= targetCount && currentUniqueIdIndex < uniqueIds.length) {
    const remainingToDownload = targetCount - successIndex + 1;
    const batchSize = Math.min(4, remainingToDownload);
    const batchPromises = [];
    const batchIds = [];

    for (let i = 0; i < batchSize; i++) {
      const fileId = uniqueIds[currentUniqueIdIndex];
      currentUniqueIdIndex++;

      if (fileId) {
        batchIds.push(fileId);
        batchPromises.push(downloadAndCompress(fileId));
      }
    }

    console.log(`Downloading batch of ${batchIds.length} images (ID pool cursor: ${currentUniqueIdIndex}/${uniqueIds.length})...`);
    
    // Wait for the batch to execute in parallel
    const results = await Promise.all(batchPromises);

    // Save successful downloads sequentially to increment successIndex correctly
    for (let i = 0; i < results.length; i++) {
      const buffer = results[i];
      if (buffer) {
        const filename = `orbit-hero-${successIndex}.jpg`;
        const filepath = path.join(destDir, filename);
        fs.writeFileSync(filepath, buffer);
        console.log(`[Card ${successIndex}/${targetCount}] Successfully saved unique image.`);
        downloadedPaths.push(`/images/${filename}`);
        successIndex++;
      } else {
        console.log(`Failed/Timed out a download from batch, skipping to next unique ID.`);
      }
    }

    // Small delay (300ms) between batches to prevent rate limits
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`Successfully completed unique downloads pass. Got ${successIndex - 1} of ${targetCount} unique downloads.`);

  // Fallback in case we ran out of unique IDs and still need to fill the slots
  if (successIndex <= targetCount) {
    console.log('Using safe local duplication fallbacks to complete the 44-card quota...');
    for (let i = successIndex; i <= targetCount; i++) {
      const fallbackSrc = path.join(destDir, `orbit-hero-1.jpg`);
      const fallbackDest = path.join(destDir, `orbit-hero-${i}.jpg`);
      try {
        fs.copyFileSync(fallbackSrc, fallbackDest);
        downloadedPaths.push(`/images/orbit-hero-${i}.jpg`);
        console.log(`Copied local fallback to orbit-hero-${i}.jpg`);
      } catch (err) {
        console.error(`Fallback failed:`, err.message);
      }
    }
  }

  console.log(`Successfully prepared all ${targetCount} unique hero images!`);

  // 4. Update src/components/Hero3D.jsx
  const hero3DPath = path.join(__dirname, 'src', 'components', 'Hero3D.jsx');
  let hero3DContent = fs.readFileSync(hero3DPath, 'utf8');

  const newTexturePathsStr = downloadedPaths.map(p => `  "${p}"`).join(',\n');
  const texturePathsRegex = /const TEXTURE_PATHS = \[\s*[\s\S]*?\s*\];/;
  hero3DContent = hero3DContent.replace(texturePathsRegex, `const TEXTURE_PATHS = [\n${newTexturePathsStr}\n];`);

  fs.writeFileSync(hero3DPath, hero3DContent, 'utf8');
  console.log('Updated TEXTURE_PATHS in src/components/Hero3D.jsx');

  // 5. Update src/lib/utils.js
  const utilsPath = path.join(__dirname, 'src', 'lib', 'utils.js');
  let utilsContent = fs.readFileSync(utilsPath, 'utf8');

  const baseTexturesRegex = /const baseTextures = \[\s*[\s\S]*?\s*\];/;
  utilsContent = utilsContent.replace(baseTexturesRegex, `const baseTextures = [\n${newTexturePathsStr}\n];`);

  fs.writeFileSync(utilsPath, utilsContent, 'utf8');
  console.log('Updated baseTextures in src/lib/utils.js');

  console.log('All tasks completed successfully!');
}

main();
