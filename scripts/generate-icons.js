// scripts/generate-icons.js
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const iconSvg = readFileSync(resolve('public/icons/icon.svg'));
const maskableSvg = readFileSync(resolve('public/icons/icon-maskable.svg'));

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Generating standard icons...');
for (const size of sizes) {
  await sharp(iconSvg)
    .resize(size, size)
    .png()
    .toFile(`public/icons/icon-${size}x${size}.png`);
  console.log(`  ✓ icon-${size}x${size}.png`);
}

console.log('Generating maskable icons...');
for (const size of [192, 512]) {
  await sharp(maskableSvg)
    .resize(size, size)
    .png()
    .toFile(`public/icons/icon-maskable-${size}x${size}.png`);
  console.log(`  ✓ icon-maskable-${size}x${size}.png`);
}

console.log('Generating apple-touch-icon...');
await sharp(iconSvg)
  .resize(180, 180)
  .png()
  .toFile('public/icons/apple-touch-icon.png');
console.log('  ✓ apple-touch-icon.png');

console.log('\n✅ All icons generated successfully!');