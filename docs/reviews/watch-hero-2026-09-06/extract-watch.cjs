// Owner-approved local chroma-key removal for the generated standalone Watch.
// Key all magenta regions, including the enclosed openings in the sport band.
const fs = require('node:fs');
const crypto = require('node:crypto');

async function extract(source, destination) {
  const sharp = (await import('sharp')).default;
  const {data, info} = await sharp(source).removeAlpha().raw().toBuffer({resolveWithObject: true});
  const {width, height, channels} = info;
  const keyed = new Uint8Array(width * height);
  for (let i = 0; i < keyed.length; i++) {
    const p = i * channels;
    keyed[i] = Math.min(data[p], data[p + 2]) - data[p + 1] >= 55 ? 1 : 0;
  }
  const mask = Buffer.from(keyed.map(value => value ? 0 : 255));
  const alpha = await sharp(mask, {raw: {width, height, channels: 1}}).blur(0.35).toColourspace('b-w').raw().toBuffer();
  for (let i = 0; i < keyed.length; i++) {
    const p = i * channels;
    if (keyed[i]) {
      alpha[i] = 0;
      data[p] = data[p + 1] = data[p + 2] = 0;
    } else if (alpha[i] < 255 && Math.min(data[p], data[p + 2]) - data[p + 1] > 8) {
      data[p] = data[p + 2] = data[p + 1];
    }
  }
  await sharp(data, {raw: {width, height, channels}}).joinChannel(alpha, {raw: {width, height, channels: 1}}).png().toFile(destination);
  console.log(JSON.stringify({width, height, channels: 4, transparentPixels: alpha.filter(value => value === 0).length, totalPixels: alpha.length, sha256: crypto.createHash('sha256').update(fs.readFileSync(destination)).digest('hex')}, null, 2));
}

const [source, destination] = process.argv.slice(2);
if (!source || !destination) throw new Error('Usage: node extract-watch.cjs source.png output.png');
extract(source, destination).catch(error => {console.error(error); process.exitCode = 1;});
