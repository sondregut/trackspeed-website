// Product-art authoring utility. Background removal explicitly approved by the owner.
// Flood only the exterior so light native UI inside the device stays untouched.

async function removeExterior(source, destination, threshold = 205, mode = 'neutral') {
  const sharp = (await import('sharp')).default;
  const {data, info} = await sharp(source).removeAlpha().raw().toBuffer({resolveWithObject: true});
  const {width, height, channels} = info;
  const outside = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0, tail = 0;
  function visit(index) {
    if (outside[index]) return;
    const offset = index * channels;
    const low = Math.min(data[offset], data[offset + 1], data[offset + 2]);
    const high = Math.max(data[offset], data[offset + 1], data[offset + 2]);
    if (mode === 'magenta') {
      if (Math.min(data[offset], data[offset + 2]) - data[offset + 1] < 55) return;
    } else if (low < threshold || high - low > 45) return;
    outside[index] = 1;
    queue[tail++] = index;
  }
  for (let x = 0; x < width; x++) { visit(x); visit((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { visit(y * width); visit(y * width + width - 1); }
  while (head < tail) {
    const index = queue[head++], x = index % width, y = Math.floor(index / width);
    if (x) visit(index - 1);
    if (x < width - 1) visit(index + 1);
    if (y) visit(index - width);
    if (y < height - 1) visit(index + width);
  }
  const mask = Buffer.from(outside.map(value => value ? 0 : 255));
  // A subpixel feather cleans raster stair steps without shrinking the device.
  const alpha = await sharp(mask, {raw: {width, height, channels: 1}}).blur(0.35).toColourspace('b-w').raw().toBuffer();
  if (mode === 'magenta') {
    for (let index = 0; index < outside.length; index++) {
      const offset = index * channels;
      if (outside[index]) {
        alpha[index] = 0;
        data[offset] = data[offset + 1] = data[offset + 2] = 0;
      } else if (alpha[index] < 255 && Math.min(data[offset], data[offset + 2]) - data[offset + 1] > 8) {
        // Remove chroma spill only from the exterior metallic edge.
        data[offset] = data[offset + 2] = data[offset + 1];
      }
    }
  }
  await sharp(data, {raw: {width, height, channels}}).joinChannel(alpha, {raw: {width, height, channels: 1}}).png().toFile(destination);
  return {source, destination, mode, width, height, removedPixels: tail, totalPixels: width * height};
}

if (require.main === module) {
  const [source, destination, threshold, mode] = process.argv.slice(2);
  if (!source || !destination) throw new Error('Usage: node remove-exterior-background.cjs source output [threshold] [neutral|magenta]');
  removeExterior(source, destination, threshold ? Number(threshold) : undefined, mode)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(error => { console.error(error); process.exitCode = 1; });
}

module.exports = {removeExterior};
