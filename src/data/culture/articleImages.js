const CC = 'Görsel: Wikimedia Commons / Wikipedia';

// Wikimedia resimlerini kullanıcının engellenmiş IP adresine takılmadan yüklemek için yüksek hızlı global DuckDuckGo imaj proxy'si
function getProxyUrl(wikimediaUrl) {
  return `https://external-content.duckduckgo.com/iu/?u=${encodeURIComponent(wikimediaUrl)}`;
}

export const ARTICLE_IMAGES = {
  'rumi-mevlana': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/e/ea/%D9%85%D9%88%D9%84%D8%A7%D9%86%D8%A7_%D8%A7%D8%AB%D8%B1_%D8%AD%D8%B3%DB%8C%D9%86_%D8%A8%D9%87%D8%B2%D8%A7%D8%AF_%28cropped%29.jpg'),
      caption: 'Mevlânâ Celaleddin Rumi portresi (Ressam Hüseyin Behzad)',
      credit: CC,
    },
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/0/0b/Mevlana_Museum_%28Green_Mausoleum%29_in_Konya_Turkey_By_Mardetanha_%2810%29.JPG'),
      caption: 'Konya — Mevlâna Müzesi ve Yeşil Kubbe (Kubbe-i Hadra)',
      credit: CC,
    },
  ],
  'yunus-emre': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/e/e1/Yunus_Emre.JPG'),
      caption: 'Yunus Emre\'nin Klasik Tasviri (Ressam Elif Naci)',
      credit: CC,
    },
  ],
  'haci-bektas-veli': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/f/f0/Hajji_Bektash_Wali.jpeg'),
      caption: 'Hacı Bektaş Veli\'nin Aslan ve Ceylanı Kucaklayan Tasviri',
      credit: CC,
    },
  ],
  'ahi-evran': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/1/11/Ahi_Evran-%C4%B1_Veli%27nin_mezar%C4%B1.jpg'),
      caption: 'Kırşehir — Ahi Evran Camii ve Kabr-i Şerifi',
      credit: CC,
    },
  ],
  'asik-veysel': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/c/cd/Asik_Veysel.jpg'),
      caption: 'Âşık Veysel Şatıroğlu (Klasik Portresi)',
      credit: CC,
    },
  ],
  'pir-sultan-abdal': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/4/48/Pir_Sultan_Abdal_heykeli.jpg'),
      caption: 'Sivas, Banaz — Pir Sultan Abdal Anıtı',
      credit: CC,
    },
  ],
  'karacaoglan': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/f/f1/Karacao%C4%9Flan.jpg'),
      caption: 'Karacaoğlan (Klasik Temsili Portresi)',
      credit: CC,
    },
  ],
  'nesimi': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/9/99/Portrait_of_Nasimi.jpg'),
      caption: 'Seyyid Nesîmî Tasviri (Klasik Portresi)',
      credit: CC,
    },
  ],
  'sems-i-tebrizi': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/c/cf/%C5%9Eems-i_Tebrizi-1.jpg'),
      caption: 'Konya — Şems-i Tebrîzî Külliyesi ve Türbesi',
      credit: CC,
    },
  ],
  'haci-bayram-veli': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/5/54/Hac%C4%B1_bayram_veli_camisi.jpg'),
      caption: 'Ankara — Hacı Bayram-ı Veli Türbesi',
      credit: CC,
    },
  ],
  'somuncu-baba': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/1/17/Somuncu_Baba_Tomb_01.jpg'),
      caption: 'Malatya, Darende — Somuncu Baba Türbesi ve Külliyesi',
      credit: CC,
    },
  ],
  'esrefoglu-rumi': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/1/19/E%C5%9Frefo%C4%9FluRumi.jpg'),
      caption: 'Bursa, İznik — Eşrefoğlu Rûmî Kabr-i Şerifi',
      credit: CC,
    },
  ],
  'ibrahim-hakki': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/8/81/World-Map-Ismail-Hakki-Erzurumi-1756.png'),
      caption: 'Erzurumlu İbrahim Hakkı\'nın Marifetname\'sindeki Kozmik Dünya Haritası',
      credit: CC,
    },
  ],
  'niyazi-misri': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/d/d9/Keir-Collection-Calligraphy-Ottoman-Poetry-Anthology.jpg'),
      caption: 'Niyâzî-i Mısrî Divan Şiiri Tasviri (Klasik Osmanlı Hat Sanatı)',
      credit: CC,
    },
  ],
  'fuzuli': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/9/92/Portrait_of_Azerbaijani_poet_Fuzuli_by_Azimzade.jpg'),
      caption: 'Büyük Aşk Şairi Fuzûlî Tasviri (Ressam Azimzade)',
      credit: CC,
    },
  ],
  'seyh-galip': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/4/4e/Galata_Mevlevihanesi_%C5%9Eeyh_Galib_T%C3%BCrbesi.JPG'),
      caption: 'İstanbul, Beyoğlu — Şeyh Galip Kabr-i Şerifi',
      credit: CC,
    },
  ],
  'tapduk-emre': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/9/99/Taptuk_Emre_K%C4%B1z%C4%B1_Tekke_-_panoramio.jpg'),
      caption: 'Ankara, Nallıhan — Taptuk Emre Türbesi ve Tekkesi',
      credit: CC,
    },
  ],
  'aziz-mahmud-hudayi': [
    {
      url: getProxyUrl('https://upload.wikimedia.org/wikipedia/commons/e/e6/Aziz_Mahmud_H%C3%BCdayi_Camii_1.jpg'),
      caption: 'İstanbul, Üsküdar — Aziz Mahmûd Hüdâyî Camii ve Türbesi',
      credit: CC,
    },
  ],
};

export function enrichArticleWithImages(article) {
  return {
    ...article,
    images: [],
    coverImage: null,
  };
}
