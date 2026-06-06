import { CULTURE_CONTENT } from '../constants/content';

const DEFAULT_MODEL = 'offline-hikmet-bilgeai';

const BILGE_AI_SYSTEM_INSTRUCTION =
  'Sen geçmiş ile gelecek arasında köprü görevi gören, Mevlânâ, Yunus Emre ve Hacı Bektaş-ı Veli bilgeliğinde konuşan bilge bir manevi rehbersin.';

const STOP_WORDS = new Set([
  'bir',
  'bu',
  'su',
  'ne',
  'nedir',
  'nasil',
  'neden',
  'kim',
  'mi',
  'midir',
  've',
  'ile',
  'icin',
  'bana',
  'anlat',
  'acikla',
  'hakkinda',
  'kisa',
  'uzun',
  'cok',
  'ben',
  'beni',
  'bende',
]);

const WISDOM_TOPICS = [
  {
    id: 'yalnizlik',
    title: 'Yalnizlik',
    keywords: ['yalniz', 'yalnizlik', 'tek', 'kimsesiz', 'anlasilmiyorum', 'bosluk'],
    guides: ['Yunus Emre', 'Mevlana', 'Asik Veysel'],
    response:
      'Yalnizlik bazen insanin terk edilmesi degil, kendi ic sesini ilk defa duymaya baslamasidir. Yunusun diliyle soylemek gerekirse gonul, kalabalikta bile yalniz kalabilir; ama temiz bir soz, iyi bir dost ve sabirli bir nefes o gonle yeniden yol acar. Mevlana bu hali bir kapı gibi okurdu: insan bazen disarida aradigi cevabi kendi icindeki sessizlikte bulur. Bugun kendini yalniz hissediyorsan, bu duyguyu kendine dusman etme; onu "ben neye ihtiyac duyuyorum?" diye soran sakin bir ogretmene cevir.',
  },
  {
    id: 'ask',
    title: 'Ask ve Sevda',
    keywords: ['ask', 'sevda', 'sevgi', 'sevmek', 'ayrilik', 'ozlem', 'kalp', 'gonul'],
    guides: ['Mevlana', 'Karacaoglan', 'Yunus Emre'],
    response:
      'Ask, eskilerin dilinde sadece birine yonelen duygu degil, insanin icini incelten buyuk bir terbiyedir. Karacaoglan askta tabiatin canliligini gorur; Mevlana ise askta insanin kendini asma imkanini. Sevmek bazen kavusmak kadar, bazen de edebi koruyarak uzak durmayi bilmek kadar derindir. Kalbin yorulduysa sunu hatirla: hakiki sevgi insani kucultmez, daha merhametli ve daha olgun hale getirir.',
  },
  {
    id: 'sabir',
    title: 'Sabir',
    keywords: ['sabir', 'dayanamiyorum', 'zor', 'bunaldim', 'yoruldum', 'tukendim', 'beklemek'],
    guides: ['Asik Veysel', 'Mevlana', 'Haci Bektas Veli'],
    response:
      'Sabir, aciyi yok saymak degil; acinin icinde dagilmadan durabilme sanatidir. Asik Veyselin hayati bize sunu ogretir: insan her eksikle eksilmez; bazen en buyuk ses, en karanlik yerden dogar. Mevlana ise derdi hamuru yoguran el gibi gorurdu; insan bazi zorluklardan gecmeden kendi derinligini taniyamaz. Bugun zorlanman seni basarisiz yapmaz. Sadece ruhun biraz dinlenmeye, sozun biraz yumusamaya, yolun biraz zamana ihtiyac duyuyor olabilir.',
  },
  {
    id: 'ofke',
    title: 'Ofke ve Kirginlik',
    keywords: ['ofke', 'sinir', 'kizgin', 'kirildim', 'haksizlik', 'incindim', 'affetmek'],
    guides: ['Haci Bektas Veli', 'Pir Sultan Abdal', 'Yunus Emre'],
    response:
      'Ofke, kalbin "burada bir yara var" deme bicimidir; fakat yara dile gecince ya sifaya ya da yeni bir yaraya donusur. Haci Bektas Velinin "diline sahip ol" olcusu bugun tam da burada konusur: hakli olmak, kalp kirmayi otomatik olarak dogru yapmaz. Pir Sultan bize haksizlik karsisinda egilmemeyi hatirlatir; Yunus ise bu durusu insanliktan cikmadan tasimayi ogretir. Kirildiysan once kendini sakinlestir, sonra sozunu sec; cunku bazi cevaplar hakli oldugu halde agir gelir.',
  },
  {
    id: 'umut',
    title: 'Umut',
    keywords: ['umut', 'umutsuz', 'cikis', 'gelecek', 'kaygı', 'kaygi', 'korku', 'basaramam'],
    guides: ['Yunus Emre', 'Asik Veysel', 'Ahi Evran'],
    response:
      'Umut, her seyin kolay olacagina inanmak degil; zor zamanin da gecici oldugunu unutmamaktir. Yunusun sadeligi burada insana iyi gelir: buyuk cevaplar bazen kucuk bir iyilikle, bugun atilan duzgun bir adimla baslar. Ahi Evranin emek ahlaki da sunu soyler: insan gelecegini sadece hayal ederek degil, sabirli ve dogru islerle kurar. Kaygin varsa onu dusman gibi gorme; sana hazirlanman gereken yeri gosteren bir isaret gibi oku.',
  },
  {
    id: 'kendini-bilmek',
    title: 'Kendini Bilmek',
    keywords: ['kendim', 'kimim', 'deger', 'ozguven', 'yetersiz', 'basarisiz', 'anlam'],
    guides: ['Nesimi', 'Mevlana', 'Yunus Emre'],
    response:
      'Kendini bilmek, kendini buyutmek degil; icindeki emaneti hor gormemektir. Nesiminin cesur sesi insana sunu hatirlatir: insan sadece korkularindan, hatalarindan ve baskalarinin ona bicdigi rolden ibaret degildir. Mevlana bu yolculugu icten ice olgunlasma olarak gorur; Yunus ise sade bir dille "once gonle bak" der gibidir. Kendini yetersiz hissettigin anlarda, degerini sadece bugunku performansinla olcme. Insan bazen filizlenmeden once uzun sure toprak altinda guc toplar.',
  },
  {
    id: 'is-emek',
    title: 'Emek ve Yol',
    keywords: ['ders', 'okul', 'sinav', 'calismak', 'emek', 'is', 'para', 'gelecek'],
    guides: ['Ahi Evran', 'Asik Veysel', 'Haci Bektas Veli'],
    response:
      'Emek, insanin hayata attigi sessiz imzadir. Ahi Evranin dunyasinda is sadece kazanc degil, karakter terbiyesidir; insan nasil calisiyorsa biraz da oyle birine donusur. Ders, sinav veya gelecek kaygisi icindeysen sunu hatirla: yolun degeri sadece sonucta degil, seni yolda nasil bir insana cevirdigindedir. Duzgun calismak, sabirli olmak ve hileye sapmamak eski bir nasihat gibi gorunur ama bugun de insanin ic huzurunu koruyan en saglam yoldur.',
  },
  {
    id: 'genel',
    title: 'Gonul Rehberligi',
    keywords: ['merhaba', 'selam', 'yardim', 'rehber', 'manevi', 'soz', 'nasihat', 'bilge'],
    guides: ['Mevlana', 'Yunus Emre', 'Haci Bektas Veli'],
    response:
      'Ben BilgeAI; eski asiklarin, bilgelerin ve gonul insanlarinin dilinden bugunun dertlerine sakin bir pencere acmak icin buradayim. Bana bir derdini, bir kavrami ya da bir kisiyi sorabilirsin. Cevabi kuru bilgi gibi degil; Mevlananin askindan, Yunusun sadeliginden, Haci Bektasin edebinden ve Asik Veyselin sabrindan suzulmus bir yorum gibi vermeye calisirim.',
  },
];

export async function sendMessageToBilgeAI(apiKey, userMessage, history = []) {
  if (!userMessage?.trim()) {
    throw new Error('Lütfen bir mesaj yazın.');
  }

  // API Anahtarındaki olası görünmez gizli karakterleri (Zero-Width Space vb.) temizle
  const cleanApiKey = (apiKey || '').trim().replace(/[^a-zA-Z0-9_.-]/g, '');

  // Eğer temizlenmiş API anahtarı boşsa doğrudan çevrimdışı motora yönlendir
  if (!cleanApiKey) {
    await delay(450);
    return generateOfflineReply(userMessage);
  }

  try {
    const contents = [];

    const systemInstructionText = `${BILGE_AI_SYSTEM_INSTRUCTION}
Sen; Mevlânâ Celâleddîn-i Rûmî, Yunus Emre ve Hacı Bektaş-ı Veli gibi Anadolu irfanı ve tasavvuf kültürünün en büyük alimlerinin, velilerinin ve bilgelerinin ruhunu, üslubunu ve derin hikmetini kuşanmış uzman bir "Manevi Danışman", "Gönül Rehberi" ve en önemlisi **"Geçmiş ile Gelecek Arasında Bir İrfan Köprüsü"** asistanısın (BilgeAI).

MİSYONUN VE GÖREVİN:
1. **Geçmiş ile Gelecek Arasında Köprü Olmak:** 13. ve 14. yüzyılın o duru, sakin, samimi Anadolu irfanını günümüzün yüksek teknolojili, hızlı, dijital ve yapay zeka ile şekillenen modern dünyasına (Geleceğe) taşımak. Yeni nesil (Gen Z & Alpha) ile eski kuşağın ve kadim bilgeliğin arasındaki kopuk bağı onarmak, iki dünya arasında sıcak bir tercüman olmaktır.
2. **Modern Dertlere Kadim Çözümler:** Kullanıcı sana modern dünyanın getirdiği sıkıntılar (sosyal medya yalnızlığı, dijital tükenmişlik, gelecek/kariyer kaygısı, sınav stresleri, yapay çevre, sanal ilişkiler, hız çılgınlığı) hakkında yazdığında, bu dertleri çok iyi analiz et. Ancak onlara modern teknik terimlerle değil, o kadim zamanların (Mevlânâ'nın aşkı, Yunus'un sadeliği, Hacı Bektaş'ın edebi) süzgecinden geçmiş manevi tavsiyelerle yanıt ver.
3. **HER KONUDA ALINTI VE SÖZ KURALI (CRITICAL):** Sana yazılan **HER HANGİ BİR KONUDA VEYA SORUDA**, yanıtının içerisinde mutlaka **Mevlânâ**, **Yunus Emre** veya **Hacı Bektaş-ı Veli**'den (bazen Şems-i Tebrîzî, Tapduk Emre veya Ahi Evran da olabilir) en az bir adet meşhur beyit, şiir veya hikmetli söz paylaşacaksın. Bu alıntıları **MUTLAKA** tırnak içinde ve kalın formatta yazacaksın (Örnek: **"Gözüyle gören değil, gönlüyle hisseden insan gerçek anlamda uyanmıştır."**).

KONUŞMA TARZI VE BİÇİMLENDİRME KURALLARI:
- Karşındaki danışana hitap ederken isim sormadıkça kullanma. "aziz can", "gönül dostum", "canım kardeşim", "güzel dostum", "yol arkadaşım" gibi kucaklayıcı hitaplar seç.
- Kesinlikle yapay zeka olduğunu hatırlatan mekanik, soğuk veya teknik terimler kullanma. Sen kalplere dokunan edebi, şefkatli bir bilge dostsun.
- Dilin tam ve pürüzsüz bir Türkçe olmalıdır. Yarım kalmış veya grameri bozuk hiçbir cümle kurma.
- CEVAP UZUNLUĞU VE ZENGİNLİK KURALI (CRITICAL): Cevaplarını asla kısa, yüzeysel veya geçiştirici tutma. Karşındaki insanın derdine derman olmak için her konuyu en az 4-5 uzun, derinlemesine, edebi, tasavvufi ve son derece doyurucu paragraflarla ele al. Tıpkı bir gönül hekimi gibi, her cümlesi şefkatle işlenmiş uzun, açıklayıcı ve edebi bir dille yaz. Kısa cevaplar vermek kesinlikle yasaktır; her zaman detaylı, zengin ve ruhu besleyen uzun rehberlik sunmalısın.
- **ÖZET PARAGRAFI KURALI:** Cevabının en sonunda, bir boşluk bıraktıktan sonra mutlaka **Kısaca Özetlemek Gerekirse:** başlığı altında konu ile alakalı 1-2 cümlelik, kalbe dokunacak küçük ve özet bir kapanış paragrafı yaz.
- Onlara elinden gelen gayreti gösterip gerisini tevekküle, zamana ve İlahi iradeye teslim etmenin (tefviz) ruhsal ferahlığını hissettir.`;
    
    // Geçmiş konuşmaları Gemini formatına dönüştürerek ekle
    for (const msg of history) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }

    // Mevcut kullanıcı mesajını ekle
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    let lastError = null;
    const modelOptions = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-flash-latest',
      'gemini-pro-latest',
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ];

    for (const modelName of modelOptions) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${cleanApiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents,
              systemInstruction: {
                parts: [{ text: systemInstructionText }]
              },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,
              }
            }),
          }
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          
          // Eğer 404 (Not Found) hatası ise bu model anahtarınız için tanımlı değildir, bir sonrakini dene
          if (response.status === 404 || errData?.error?.message?.includes('not found')) {
            console.warn(`Model ${modelName} bulunamadı veya desteklenmiyor, bir sonraki deneniyor...`);
            lastError = new Error(errData?.error?.message || 'Model bulunamadı.');
            continue;
          }
          
          console.warn('Gemini API Hatası:', errData);
          throw new Error(errData?.error?.message || 'Gemini API bağlantısı başarısız oldu.');
        }

        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!replyText) {
          throw new Error('Yapay zekadan geçersiz cevap alındı.');
        }

        return replyText; // Başarılı, cevabı dön
      } catch (error) {
        lastError = error;
        // Eğer 404 dışı bir hata ise (örn. internet kopması veya geçersiz cevap) doğrudan fırlat
        if (error.message?.includes('başarısız oldu') || error.message?.includes('geçersiz cevap')) {
          throw error;
        }
      }
    }

    // Eğer tüm modeller denendi ve hepsi 404 verdiyse en son hatayı fırlat
    throw lastError || new Error('Desteklenen hiçbir model ile bağlantı kurulamadı.');
  } catch (error) {
    console.warn('Gemini API bağlantısı kurulamadığı için çevrimdışı moda geçiliyor:', error);
    await delay(450);
    const offlineReply = generateOfflineReply(userMessage);
    return `${offlineReply}\n\n*(Not: Şu anda yapay zeka sunucu bağlantısı kısıtlı olduğu için BilgeAI bu cevabı çevrimdışı irfan havuzundan süzerek hazırladı.)*`;
  }
}

function generateOfflineReply(userMessage) {
  const normalized = normalizeText(userMessage);
  const tokens = tokenize(normalized);
  const topic = findBestWisdomTopic(normalized, tokens);
  const article = findBestGuide(normalized, tokens);
  const intent = detectIntent(normalized);

  if (topic && article) {
    return composeWisdomAndGuideReply(topic, article, intent);
  }

  if (topic) {
    return composeWisdomReply(topic, intent);
  }

  if (article) {
    return composeGuideReply(article, intent);
  }

  return composeFallbackReply(tokens);
}

function findBestWisdomTopic(normalized, tokens) {
  const scored = WISDOM_TOPICS.map((topic) => {
    const score = topic.keywords.reduce((sum, keyword) => {
      const normalizedKeyword = normalizeText(keyword);
      if (normalized.includes(normalizedKeyword)) return sum + 4;
      if (tokens.includes(normalizedKeyword)) return sum + 2;
      return sum;
    }, 0);
    return { topic, score };
  }).sort((a, b) => b.score - a.score);

  return scored[0]?.score > 0 ? scored[0].topic : null;
}

function findBestGuide(normalized, tokens) {
  const scored = CULTURE_CONTENT.map((article) => {
    const haystack = normalizeText(
      [
        article.title,
        article.subtitle,
        article.category,
        article.excerpt,
        ...(article.highlights || []),
        ...(article.sections || []).flatMap((section) => [
          section.heading,
          ...(section.paragraphs || []),
        ]),
      ]
        .filter(Boolean)
        .join(' ')
    );

    const score = tokens.reduce((sum, token) => {
      if (token.length < 3 || STOP_WORDS.has(token)) return sum;
      return haystack.includes(token) ? sum + 1 : sum;
    }, normalized && haystack.includes(normalized) ? 4 : 0);

    return { article, score };
  }).sort((a, b) => b.score - a.score);

  return scored[0]?.score > 0 ? scored[0].article : null;
}

function composeWisdomAndGuideReply(topic, article, intent) {
  return `${openingForIntent(intent)} ${topic.response}\n\nBu derdi "${article.title}" basligiyla da okuyabiliriz. ${article.excerpt}\n\nBugune dusen pay: ${pickHighlight(article)} Eski soz burada sana hazir bir cevap dayatmaz; sadece kalbinin daha sakin dusunebilecegi bir isik yakar.`;
}

function composeWisdomReply(topic, intent) {
  return `${openingForIntent(intent)} ${topic.response}\n\nBu cevabi ${topic.guides.join(', ')} gibi gonul rehberlerinin diline yakin dusunebilirsin. Istersen bana derdini biraz daha ac; sana daha kisa bir soz, daha uzun bir aciklama ya da gunluk hayata uygulanacak bir nasihat seklinde cevap verebilirim.`;
}

function composeGuideReply(article, intent) {
  return `${openingForIntent(intent)} ${article.title}, bugunun insanina sadece gecmiste yasamis bir isim olarak degil, bir yasama olcusu olarak da konusur. ${article.excerpt}\n\n${pickHighlight(article)}\n\nBu kisinin dilinden bugune bakinca mesele sudur: eski sozler, yeni dertleri ortadan kaldirmayabilir; ama insana o derdi daha vakur, daha temiz ve daha anlamli tasimayi ogretebilir.`;
}

function composeFallbackReply(tokens) {
  const subject = tokens.find((token) => !STOP_WORDS.has(token) && token.length > 3);
  if (subject) {
    return `"${subject}" dediginde ben bunu bir gonul meselesi gibi okuyorum. Eskilerin usulunde her dert hemen cozulmesi gereken bir problem degil; bazen insanin kendini tanimasina yardim eden bir isarettir.\n\nBunu Mevlana gibi ask ve anlam, Yunus Emre gibi sade sevgi, Haci Bektas Veli gibi edep, Asik Veysel gibi sabir tarafindan dusunebiliriz. Dilersen derdini biraz daha ac; sana daha nokta atisi bir soz ve aciklama vereyim.`;
  }

  return 'Bana bir derdini ya da bir kavrami yazabilirsin: yalnizlik, ask, sabir, ofke, umut, kendini bilmek, okul kaygisi gibi. Ben de bunu eski asiklarin ve bilgelerin dilinden bugune tasiyan bir cevapla yorumlayayim.';
}

function pickHighlight(article) {
  return article.highlights?.[0] || 'Gonul, dogru sozle biraz daha sakin nefes alir.';
}

function openingForIntent(intent) {
  if (intent === 'quote') return 'Eskilerin soz ikliminden bakarsak:';
  if (intent === 'summary') return 'Kisa ve derli toplu soyleyeyim:';
  if (intent === 'comfort') return 'Once sunu sakin bir yere koyalim:';
  return 'Bilgece bir cerceveyle soylemek gerekirse:';
}

function detectIntent(normalized) {
  if (normalized.includes('soz') || normalized.includes('alinti')) return 'quote';
  if (normalized.includes('kisa') || normalized.includes('ozet')) return 'summary';
  if (normalized.includes('dert') || normalized.includes('uzgun') || normalized.includes('kotu')) {
    return 'comfort';
  }
  return 'explain';
}

function tokenize(text) {
  return text
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { BILGE_AI_SYSTEM_INSTRUCTION, DEFAULT_MODEL, WISDOM_TOPICS };
