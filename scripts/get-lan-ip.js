const os = require('os');
const nets = os.networkInterfaces();
const candidates = [];

for (const [name, list] of Object.entries(nets)) {
  for (const iface of list) {
    if (
      iface.family === 'IPv4' &&
      !iface.internal &&
      !iface.address.startsWith('169.254')
    ) {
      candidates.push({ name: name.toLowerCase(), address: iface.address });
    }
  }
}

const pick = (patterns) =>
  candidates.find((c) => patterns.some((p) => c.name.includes(p)));

const best =
  pick(['wi-fi', 'wifi', 'wlan', 'wireless']) ||
  pick(['ethernet', 'eth']) ||
  candidates[0];

if (best) {
  process.stdout.write(best.address);
  process.exit(0);
}

process.exit(1);
