import fs from 'fs';
import https from 'https';
import tar from 'tar';
import zlib from 'zlib';
import { pipeline } from 'stream';

const dumpUrl = 'https://glyphwiki.org/dump.tar.gz';
const downloadPath = 'utils/temp/dump.tar.gz';

async function downloadFile(url, targetFile) {
  return await new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const code = response.statusCode ?? 0;

        if (code >= 400) {
          return reject(new Error(response.statusMessage));
        }

        // handle redirects
        if (code > 300 && code < 400 && !!response.headers.location) {
          return downloadFile(response.headers.location, targetFile);
        }

        // save the file to disk
        const fileWriter = fs.createWriteStream(targetFile).on('finish', () => {
          resolve({});
        });

        response.pipe(fileWriter);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function untar(tarFile, targetFile) {
  var extractor = tar.x({ path: targetFile });

  await pipeline(
    fs.createReadStream(tarFile),
    zlib.createGunzip(),
    fs.createWriteStream(targetFile),
  );
}

// await downloadFile(dumpUrl, downloadPath);
await untar(downloadPath, 'utils/temp/dump');
