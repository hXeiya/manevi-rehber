const fs = require('fs');
const path = require('path');
const https = require('https');

const assetsDir = path.join(__dirname, '..', 'assets');

// Wikipedia Commons dosya isimlerinin tam listesi (Special:FilePath ile doğrudan çözümlenir)
const ALIMS_FILES = {
  'rumi-mevlana': 'Maulana_Jelaledin_Muhammad_Rumi_in_konya.jpg',
  'yunus-emre': 'Retrato_Yunus_Emre.jpg',
  'haci-bektas-veli': 'Hacıbektaş_Müzesi_Girişi.jpg',
  'ahi-evran': 'Ahi_Evran_Cami.jpg',
  'asik-veysel': 'Veysel_Satiroglu.jpg',
  'pir-sultan-abdal': 'Pir_Sultan_Abdal_Heykeli.jpg',
  'karacaoglan': 'Karacaoğlan_Heykeli.jpg',
  'nesimi': 'Seyyid_Nesimi_miniature.jpg',
  'sems-i-tebrizi': 'Shams_Tabrizi_Konya.jpg',
  'haci-bayram-veli': 'Haci_Bayram_Mosque_Ankara.jpg',
  'somuncu-baba': 'Somuncu_Baba_Külliyesi.jpg',
  'esrefoglu-rumi': 'Eşrefoğlu_Rumi_Türbesi.jpg',
  'ibrahim-hakki': 'Ibrahim_Hakki_tomb.jpg',
  'niyazi-misri': 'Niyazi_i_Misri_dergahi.jpg',
  'fuzuli': 'Fuzuli_portrait.jpg',
  'seyh-galip': 'Galata_Mevlevihanesi_museum.JPG',
  'tapduk-emre': 'Nallıhan_Taptuk_Emre.jpg',
  'aziz-mahmud-hudayi': 'Aziz_Mahmud_Hüdayi_Türbesi.jpg'
};

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function downloadImage(fileName, filepath, retryCount = 0) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
  
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    };

    https.get(url, options, (res) => {
      // Yönlendirmeleri takip et (Wikimedia Commons Special:FilePath 302 yönlendirmesi yapar)
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        return downloadDirect(redirectUrl, filepath)
          .then(resolve)
          .catch((err) => {
            if (retryCount < 2) {
              console.log(`Retrying download for ${fileName} after 8 seconds...`);
              return delay(8000)
                .then(() => downloadImage(fileName, filepath, retryCount + 1))
                .then(resolve)
                .catch(reject);
            }
            reject(err);
          });
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to resolve: HTTP Status ${res.statusCode}`));
      }

      // Eğer doğrudan 200 dönmüşse (yönlendirme olmadan) indir
      saveStream(res, filepath, resolve, reject);
    }).on('error', reject);
  });
}

function downloadDirect(url, filepath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'image/*'
      }
    };

    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Redirection
        return downloadDirect(res.headers.location, filepath).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Direct download HTTP Status ${res.statusCode}`));
      }
      saveStream(res, filepath, resolve, reject);
    }).on('error', reject);
  });
}

function saveStream(res, filepath, resolve, reject) {
  const fileStream = fs.createWriteStream(filepath);
  res.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    resolve();
  });

  fileStream.on('error', (err) => {
    fs.unlink(filepath, () => {});
    reject(err);
  });
}

async function start() {
  console.log('Starting local alim gallery builder via Special:FilePath API...');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const entries = Object.entries(ALIMS_FILES);
  for (let i = 0; i < entries.length; i++) {
    const [id, fileName] = entries[i];
    const filename = `alim-${id}.jpg`;
    const filepath = path.join(assetsDir, filename);

    console.log(`[${i + 1}/${entries.length}] Crawling ${fileName} -> ${filename}...`);
    try {
      await downloadImage(fileName, filepath);
      console.log(`✓ Successfully downloaded and saved ${filename}`);
    } catch (e) {
      console.error(`✗ Failed for ${id}:`, e.message);
    }

    if (i < entries.length - 1) {
      console.log('Sleeping 5 seconds to respect Wikimedia API guidelines...');
      await delay(5000);
    }
  }
  console.log('Local gallery download loop finished!');
}

start();
