const { execSync } = require('child_process');
const path = require('path');

let ip = process.env.REACT_NATIVE_PACKAGER_HOSTNAME;
if (!ip) {
  try {
    ip = execSync(`node "${path.join(__dirname, 'get-lan-ip.js')}"`, {
      encoding: 'utf8',
    }).trim();
  } catch {
    ip = '';
  }
}

if (ip) {
  console.log('');
  console.log('--- Expo Go manuel baglanti (Wi-Fi) ---');
  console.log(`exp://${ip}:8081`);
  console.log('Expo Go - Enter URL manually - yukaridaki adresi yapistirin');
  console.log('---------------------------------------');
  console.log('');
}
