/**
 * Geçici placeholder PNG dosyaları oluşturur (geliştirme için).
 * Üretim öncesi assets/ içindeki görselleri kendi markanızla değiştirin.
 */
const fs = require('fs');
const path = require('path');

const MINIMAL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

const assetsDir = path.join(__dirname, '..', 'assets');
const files = ['icon.png', 'splash.png', 'adaptive-icon.png'];

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

for (const file of files) {
  const target = path.join(assetsDir, file);
  fs.writeFileSync(target, MINIMAL_PNG);
  console.log('Oluşturuldu:', target);
}

console.log('\nPlaceholder assetler hazır. Play Store öncesi gerçek görsellerle değiştirin.');
