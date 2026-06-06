const fs = require('fs');
const path = require('path');
const https = require('https');

const assetsDir = path.join(__dirname, '..', 'assets');

const IMAGES_TO_DOWNLOAD = {
  'rumi-mevlana': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/%D9%85%D9%88%D9%84%D8%A7%D9%86%D8%A7_%D8%A7%D8%AB%D8%B1_%D8%AD%D8%B3%DB%8C%D9%86_%D8%A8%D9%87%D8%B2%D8%A7%D8%AF_%28cropped%29.jpg',
  'yunus-emre': 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Retrato_Yunus_Emre.jpg',
  'haci-bektas-veli': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Hac%C4%B1bekta%C5%9F_M%C3%BCzesi_Giri%C5%9Fi.jpg',
  'ahi-evran': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Ahi_Evran_Cami.jpg',
  'asik-veysel': 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Veysel_Satiroglu.jpg',
  'pir-sultan-abdal': 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Pir_Sultan_Abdal_Heykeli.jpg',
  'karacaoglan': 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Karacao%C4%9Flan_Heykeli.jpg',
  'nesimi': 'https://upload.wikimedia.org/wikipedia/commons/7/78/Seyyid_Nesimi_miniature.jpg',
  'sems-i-tebrizi': 'https://upload.wikimedia.org/wikipedia/commons/d/da/Shams_Tabrizi_Konya.jpg',
  'haci-bayram-veli': 'https://upload.wikimedia.org/wikipedia/commons/7/79/Haci_Bayram_Mosque_Ankara.jpg',
  'somuncu-baba': 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Somuncu_Baba_K%C3%BClliyesi.jpg',
  'esrefoglu-rumi': 'https://upload.wikimedia.org/wikipedia/commons/1/18/E%C5%9Frefo%C4%9Flu_Rumi_T%C3%BCrbesi.jpg',
  'ibrahim-hakki': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Ibrahim_Hakki_tomb.jpg',
  'niyazi-misri': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Niyazi_i_Misri_dergahi.jpg',
  'fuzuli': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Fuzuli_portrait.jpg',
  'seyh-galip': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Galata_Mevlevihanesi_museum.JPG',
  'tapduk-emre': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Nall%C4%B1han_Taptuk_Emre.jpg',
  'aziz-mahmud-hudayi': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Aziz_Mahmud_H%C3%BCdayi_T%C3%BCrbesi.jpg'
};

const headers = {
  'User-Agent': 'ManeviRehber/1.0 (Educational culture app; React Native Expo)',
  'Accept': 'image/*'
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Redirection
        return download(res.headers.location, filepath).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download image: ${res.statusCode} for url ${url}`));
      }

      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${path.basename(filepath)}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function start() {
  console.log('Downloading alim images locally with 3-second delay to avoid rate-limiting...');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const entries = Object.entries(IMAGES_TO_DOWNLOAD);
  for (let i = 0; i < entries.length; i++) {
    const [id, url] = entries[i];
    const filename = `alim-${id}.jpg`;
    const filepath = path.join(assetsDir, filename);

    console.log(`[${i + 1}/${entries.length}] Requesting ${filename}...`);
    try {
      await download(url, filepath);
    } catch (e) {
      console.error(`Failed for ${id}:`, e.message);
    }

    if (i < entries.length - 1) {
      console.log('Waiting 3 seconds to respect rate limits...');
      await delay(3000);
    }
  }
  console.log('All image downloads completed successfully!');
}

start();
