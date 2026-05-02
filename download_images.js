const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const urls = [
  "https://drive.google.com/file/d/13Zj1nyCn5myNvwVETpD9bKUtfZNKnOOS/preview",
  "https://drive.google.com/file/d/1_L5IEqBLwQRA57HxtGnHkFRiJO989RAK/preview",
  "https://drive.google.com/file/d/1MGT3s2nNolAKD77ymGFEb1XXRHk53Fsw/preview",
  "https://drive.google.com/file/d/1bvQH1YlU82ZGA098wbaD5jV1o3E-U1Rb/preview",
  "https://drive.google.com/file/d/1Umkf6ndl7NsX0Uk_7OmeSHRRRRJfMaZV/preview",
  "https://drive.google.com/file/d/1OZqV8_31qD5avYsc24I17rot6c3WCMV-/preview",
  "https://drive.google.com/file/d/1buSjzwDTXx0bSRyBJAC-U8O3HsABUMob/preview",
  "https://drive.google.com/file/d/1vkDlBE_-4Lql_07P1kEM-z28ZH3osHyS/preview",
  "https://drive.google.com/file/d/1x0Jg63kGcCUCsZfJvEj64O2VElkyMGJz/preview",
  "https://drive.google.com/file/d/1x0Jg63kGcCUCsZfJvEj64O2VElkyMGJz/preview",
  "https://drive.google.com/file/d/1x0Jg63kGcCUCsZfJvEj64O2VElkyMGJz/preview",
  "https://drive.google.com/file/d/1tvLs0us-at0ot62v8YaAjxMiy3mskYvi/preview",
  "https://drive.google.com/file/d/1TDhOP7O7fhsmwNuGLxdsXdF9yAZysZQB/preview",
  "https://drive.google.com/file/d/1C6FlZvvoVmroGFqQM9RXqXgjy6SeTVhl/preview",
  "https://drive.google.com/file/d/1dQdz7FTrfj26CfJlcbwPt7UIRHEqNt-B/preview",
  "https://drive.google.com/file/d/1Uqd1IaW7G0vofAgr61MTaekwD5f2-9Qe/preview",
  "https://drive.google.com/file/d/1GqLXE08z53bUsdYAS5hhWpUAkPojzL3e/preview",
  "https://drive.google.com/file/d/1_lw1Z6YghWswqIIJdvq6mGt7OLXEr-oU/preview",
  "https://drive.google.com/file/d/15lYDmAo7vOo_ikvvUZaWguVaQfbkiUQ9/preview",
  "https://drive.google.com/file/d/1U6MJeEQjY2p-Onqod3PMB8LCMN3pUbOQ/preview",
  "https://drive.google.com/file/d/1be75HQEnP16H9NkNOkywdPlnj_jg4h2H/preview",
  "https://drive.google.com/file/d/1m1pq7t_DW-UqK5-GhAgwy-IcJ1nxBL88/preview",
  "https://drive.google.com/file/d/1pFxFsSc3iOYCX9JUatJyNx0AngU9Baeu/preview",
  "https://drive.google.com/file/d/1OInkT1lUY9RoFVcOFdTPklRk8V6L1gmv/preview",
  "https://drive.google.com/file/d/1l4FAGvSus6lzT8wPTS1J2BPpCxOYfCib/preview",
  "https://drive.google.com/file/d/1GtgQuM3Iq058VYmO4ggfQ7AVXqhLLVFu/preview",
  "https://drive.google.com/file/d/19XSkeolpR-r4xa6khmRaas2b9Y-qE5gY/preview",
  "https://drive.google.com/file/d/1PI5nJ3KA793ngl1UX41r8M2vapPB4_OV/preview",
  "https://drive.google.com/file/d/1d8Q3thJaETIrbsv2x-h2gSHsqdWcX_vC/preview",
  "https://drive.google.com/file/d/1awMZQV1AviBuHyFmPj-C023y0wm9kNTF/preview",
  "https://drive.google.com/file/d/1YVap3U9l4zBjihfdkKdRN0VrXqeESdT9/preview",
  "https://drive.google.com/file/d/1YS4EwyzZsfkIZEB_cHZ5Slf5V9S0tS-V/preview",
  "https://drive.google.com/file/d/1Dr4ONjuxRlemr_oRbn_Xi8t_rqjxrDBn/preview",
  "https://drive.google.com/file/d/1loHAjv2QiYDDpb2luUaoI9ePvqyDY64D/preview",
  "https://drive.google.com/file/d/1wmqKWSyhzAus0AQdY3pRqBS_qhai6bSK/preview",
  "https://drive.google.com/file/d/16dPM7v_GysQ4OyGOYkvbxNTOq8Ifyc62/preview"
];

// Remove duplicates
const uniqueUrls = [...new Set(urls)];

const destDir = path.join(__dirname, 'public', 'images');

async function downloadAndConvert(url, index) {
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  if (!fileIdMatch) {
    console.log('Could not extract file ID from', url);
    return null;
  }
  const fileId = fileIdMatch[1];
  
  // Google Drive download URL format for large/small files
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  return new Promise((resolve, reject) => {
    const doReq = (reqUrl) => {
      https.get(reqUrl, (response) => {
        if (response.statusCode === 302 || response.statusCode === 303) {
          // Handle redirect
          doReq(response.headers.location);
        } else if (response.statusCode !== 200) {
          // Sometimes large files show a warning page. A more robust downloader might be needed, but we try this first.
          console.log(`Failed to download ${fileId}, status: ${response.statusCode}`);
          resolve(null);
        } else {
          const chunks = [];
          response.on('data', chunk => chunks.push(chunk));
          response.on('end', async () => {
            const buffer = Buffer.concat(chunks);
            const filename = `orbit-gd-${index}.avif`;
            const filepath = path.join(destDir, filename);

            try {
              // The buffer might be an HTML page if it's too large and Google asks for virus scan confirmation.
              // Let's check if it's an image. Sharp will throw an error if not.
              await sharp(buffer)
                .avif({ quality: 60 })
                .toFile(filepath);
              console.log(`Saved ${filename}`);
              resolve(`/images/${filename}`);
            } catch (err) {
              console.error(`Failed to convert ${fileId}. Probably not an image or requires virus scan confirmation.`);
              resolve(null);
            }
          });
        }
      }).on('error', (e) => {
        console.error(e);
        resolve(null);
      });
    };
    doReq(downloadUrl);
  });
}

async function main() {
  const newPaths = [];
  for (let i = 0; i < uniqueUrls.length; i++) {
    const p = await downloadAndConvert(uniqueUrls[i], i + 1);
    if (p) newPaths.push(p);
  }
  console.log('---NEW_PATHS---');
  console.log(JSON.stringify(newPaths, null, 2));
}

main();
