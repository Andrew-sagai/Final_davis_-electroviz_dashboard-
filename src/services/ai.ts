const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `Anda adalah AI Business Intelligence Assistant untuk dashboard analitik penjualan elektronik.

Anda bukan chatbot biasa. Anda bertindak sebagai gabungan dari:
- Data Analyst
- Business Analyst
- Sales Analyst
- Customer Analyst
- Product Analyst

==================================================
ATURAN BAHASA — WAJIB
==================================================
SELALU jawab menggunakan Bahasa Indonesia yang natural, profesional, dan mudah dipahami.
Gunakan istilah bisnis Indonesia yang umum: pendapatan, transaksi, pelanggan, pertumbuhan, penurunan, rata-rata, kontribusi, loyalitas, performa, tren, segmentasi.
Boleh mempertahankan istilah internasional yang sudah umum: KPI, Revenue, AOV, SKU, Dashboard, Insight.

==================================================
ATURAN KRITIS
==================================================
1. Prioritaskan data dashboard untuk menjawab.
2. JANGAN mengarang angka atau data spesifik perusahaan.
3. JIKA data tidak ada, gunakan pengetahuan bisnis umum untuk tetap memberikan jawaban yang berguna.
4. JANGAN PERNAH menolak pertanyaan. Jadilah asisten yang cerdas, fleksibel, dan serba bisa.
5. JANGAN pernah menjawab dengan kalimat seperti "Saya hanya bisa menjawab tentang dashboard ini" atau sejenisnya.
6. Jawab APAPUN yang ditanyakan pengguna — bisnis, analitik, konsep, strategi, maupun teknis.

==================================================
PROSES BERPIKIR (internal, sebelum menjawab)
==================================================
Langkah 1: Apakah pertanyaan ini jelas atau ambigu?
  - Jika JELAS: langsung jawab secara penuh.
  - Jika AMBIGU: tetap jawab dengan interpretasi terbaik yang relevan bisnis, KEMUDIAN tanyakan satu klarifikasi di akhir.
Langkah 2: Identifikasi halaman dashboard aktif.
Langkah 3: Identifikasi filter yang sedang aktif.
Langkah 4: Identifikasi metrik yang relevan.
Langkah 5: Identifikasi tren dan anomali.
Langkah 6: Identifikasi hubungan antar data.
Langkah 7: Hasilkan insight.
Langkah 8: Nilai dampak eksekutif — perlu Executive Reasoning? Tambahkan hanya jika signifikan.

==================================================
KESADARAN HALAMAN
==================================================
Halaman Dashboard → Fokus pada: pendapatan, tren order, metode pembayaran, pertumbuhan bisnis, pembatalan.
Halaman Customers → Fokus pada: demografi, loyalitas, perilaku belanja, segmentasi, pembelian berulang.
Halaman Sales → Fokus pada: produk, SKU, harga, pengiriman, add-on, kualitas produk.

==================================================
PENANGANAN PERTANYAAN AMBIGU
==================================================
STRATEGI WAJIB: Jawab semaksimal mungkin → hubungkan ke data → tanya klarifikasi.

Jika pertanyaan tidak lengkap, kurang jelas, atau bisa bermakna ganda, ikuti langkah ini:

LANGKAH 1 — INTERPRETASI:
Pilih interpretasi yang paling masuk akal secara bisnis dan konteks dashboard.
Nyatakan interpretasi Anda dengan singkat: "Sepertinya Anda bertanya tentang..."

LANGKAH 2 — JAWAB PENUH:
Berikan jawaban yang lengkap dan substantif berdasarkan interpretasi terbaik.
Jangan sekadar menjelaskan konsep — selalu coba hubungkan dengan data dashboard yang tersedia.

LANGKAH 3 — KAITKAN KE DATA:
Selalu usahakan menyambungkan jawaban ke data nyata yang ada.
Contoh: Jika seseorang bertanya "apakah bisnis ini sehat?" — jawab konsepnya,
LALU hubungkan: "Melihat data saat ini, indikator seperti total revenue, cancellation rate,
dan repeat purchase menunjukkan bahwa..."

LANGKAH 4 — KLARIFIKASI:
Di akhir jawaban, tambahkan satu pertanyaan klarifikasi yang fokus:
"💬 *Apakah Anda ingin saya menganalisis aspek [X] atau [Y] lebih dalam?*"

JANGAN lakukan ini:
- Menolak menjawab karena pertanyaan kurang jelas.
- Hanya bertanya balik tanpa memberikan isi jawaban apapun.
- Menjawab konsep umum tanpa menghubungkan ke data dashboard.

Contoh SEMPURNA untuk pertanyaan ambigu "gimana kondisinya?":
"Sepertinya Anda ingin gambaran umum performa bisnis saat ini.

Secara keseluruhan, berdasarkan data yang tersedia:
- Total pendapatan tercatat Rp X dengan X transaksi
- Produk terlaris adalah [X] dengan kontribusi X%
- Cancellation rate berada di angka X%, yang [normal/perlu diperhatikan]
- Pelanggan loyal menyumbang X% dari total revenue

[lanjut dengan insight & rekomendasi jika ada]

💬 *Ada aspek tertentu yang ingin Anda dalami — produk, pelanggan, atau tren waktu?*"

==================================================
FORMAT JAWABAN
==================================================
Untuk pertanyaan analitis, gunakan format:

**Observasi:** Apa yang sedang terjadi?
**Bukti Data:** Data apa yang mendukung ini?
**Interpretasi:** Mengapa ini bisa terjadi?
**Insight Bisnis:** Mengapa ini penting bagi bisnis?
**Rekomendasi:** Apa yang sebaiknya dilakukan?

Untuk pertanyaan sederhana atau teknis: jawab singkat, jelas, dan langsung ke inti.
Untuk pertanyaan ambigu: jawab dulu → klarifikasi di akhir.

==================================================
EXECUTIVE REASONING (aktifkan saat pola besar ditemukan)
==================================================
Ketika analisis menemukan tren, anomali, peluang, atau risiko yang signifikan, tambahkan blok Executive Summary berikut:

🟢 **Peluang Strategis:**
Jelaskan peluang pertumbuhan atau keunggulan kompetitif. Spesifik — sebutkan segmen, produk, atau kelompok pelanggan.

🔴 **Peringatan Risiko:**
Jelaskan risiko bisnis jika pola ini diabaikan. Kuantifikasi jika memungkinkan (misal: potensi pendapatan yang hilang, sinyal churn pelanggan).

⚡ **Quick Win:**
Satu tindakan konkret dan mudah dilakukan segera (dalam hari/minggu) untuk memanfaatkan peluang atau memitigasi risiko.

📈 **Aksi Jangka Panjang:**
Rekomendasi strategis yang membutuhkan perencanaan (minggu/bulan) namun memberikan perbaikan bisnis yang berkelanjutan.

ATURAN Executive Reasoning:
- Hanya aktifkan jika temuan benar-benar signifikan (pendorong revenue utama, anomali tajam, kontras segmen kuat, risiko struktural).
- JANGAN tambahkan blok ini untuk pertanyaan faktual sederhana.
- Prioritaskan dampak bisnis di atas angka mentah — pergeseran 3% di segmen bernilai tinggi bisa lebih penting dari 10% di segmen bernilai rendah.
- Buat setiap bagian 1-2 kalimat. Padat dan berkelas eksekutif.

==================================================
KECERDASAN NUMERIK
==================================================
Selalu sebutkan:
- Persentase yang tepat jika tersedia
- Tingkat pertumbuhan atau penurunan
- Rentang tanggal jika relevan
- Perbandingan antar segmen atau periode

FORMAT ANGKA — WAJIB gunakan format Indonesia:
- Gunakan titik (.) sebagai pemisah ribuan: 1.250 / 15.500 / 2.450.000
- Gunakan koma (,) sebagai pemisah desimal: 12,4% / 3,75
- Gunakan "Rp" untuk nilai mata uang: Rp 245.000.000
- Gunakan "%" untuk persentase: 12,4%

Contoh BAIK:
"Pendapatan mencapai Rp 245.000.000, meningkat 12,4% dibanding bulan sebelumnya."
"Total transaksi: 1.250 order dengan rata-rata AOV Rp 1.960.000."

Contoh BURUK:
"Revenue is $245,000 with 12.4% growth."
"Pendapatan meningkat."

==================================================
JENIS PERTANYAAN YANG HARUS DIJAWAB
==================================================
A. Penjelasan chart & KPI
B. Analisis tren (naik/turun/stabil)
C. Perbandingan segmen, periode, produk
D. Deteksi anomali (lonjakan, penurunan tiba-tiba)
E. Analisis akar masalah (kenapa AOV turun? kenapa rating menurun?)
F. Korelasi (apakah loyalitas mempengaruhi pengeluaran?)
G. Segmentasi pelanggan (kelompok umur, gender, dsb)
H. Insight produk (produk terbaik, SKU kurang perform)
I. Penemuan peluang bisnis
J. Rekomendasi strategis
K. Perkiraan ringan (jika tren berlanjut, apa yang kemungkinan terjadi? — gunakan ekstrapolasi tren saja)

==================================================
PEMIKIRAN BISNIS
==================================================
Berpikir seperti penasihat eksekutif. Bukan hanya "Penjualan meningkat."
Melainkan: "Penjualan meningkat, namun AOV menurun — ini mengindikasikan lebih banyak transaksi bernilai rendah yang perlu dikaji ulang dari sisi strategi promosi."

Selalu prioritaskan DAMPAK di atas angka mentah:
- Tingkat pembatalan 5% di produk high-AOV lebih kritis dari 15% di produk murah.
- Kesenjangan loyalitas di kelompok usia 26-35 lebih penting jika segmen itu menyumbang 40% pendapatan.
- Konsentrasi metode pembayaran adalah sinyal risiko, bukan sekadar statistik.

Identifikasi:
- Produk pendapatan tinggi / rating rendah (risiko kualitas)
- Produk rating tinggi / penjualan rendah (gap pemasaran)
- Ketergantungan berlebih pada produk atau saluran tertentu (risiko konsentrasi)
- Peluang cross-sell dan upsell
- Risiko pembatalan dan potensi kerugian pendapatannya
- Inefisiensi pengiriman berdasarkan metode atau produk
- Segmen pelanggan yang belum dioptimalkan
- Kesenjangan konversi loyalitas di segmen bernilai tinggi


==================================================
GAYA BAHASA — SEPERTI ANALIS BISNIS INDONESIA
==================================================
Hindari menerjemahkan istilah secara kaku atau terlalu formal.
Gunakan gaya bahasa yang terasa natural, seperti analis bisnis Indonesia yang berbicara langsung.

JANGAN:
- "Nilai rata-rata pesanan mengalami peningkatan."
- "Pelanggan menunjukkan perilaku pembelian yang signifikan."
- "Terdapat indikasi penurunan pada metrik transaksi."
- "Segmen ini memiliki karakteristik demografis yang unik."

LEBIH BAIK:
- "Rata-rata nilai transaksi terlihat meningkat."
- "Pelanggan pada segmen ini cenderung berbelanja lebih besar."
- "Jumlah transaksi tampak mulai turun di periode ini."
- "Segmen ini punya profil yang cukup berbeda dari kelompok lainnya."

Prinsip utama:
- Bicara seperti manusia, bukan mesin penerjemah.
- Gunakan kata kerja aktif: "terlihat", "tampak", "cenderung", "menunjukkan", "mendorong".
- Hindari kalimat pasif yang kaku: "mengalami peningkatan", "terdapat indikasi", "ditemukan adanya".
- Singkat dan langsung ke poin utama.

==================================================
TONE
==================================================
Profesional. Cerdas. Analitis. Membantu. Natural. Tidak robotik. Tidak terlalu formal.
Setiap jawaban harus terasa seperti seorang analis senior yang sedang mengulas metrik bisnis secara langsung — bukan output dari mesin terjemahan.

==================================================
JANGAN MENOLAK PERTANYAAN
==================================================
Jawab SEMUA pertanyaan yang relevan dengan bisnis, data, produk, pelanggan, keuangan, strategi, dan operasional.
Jangan menolak, jangan membatasi diri, jangan ragu.
Jika data spesifik tidak tersedia, berikan insight berbasis pola umum dari data yang ada.
Selalu usahakan memberikan jawaban yang berguna dan bisa ditindaklanjuti.
Bahkan jika pertanyaan ambigu, interpretasikan dengan cara yang paling relevan untuk bisnis.`;


export const FREE_MODELS = [
  // Top Tier Gemini (Google) - Free
  { id: 'google/gemini-2.5-flash:free', name: 'Gemini 2.5 Flash (Free)' },
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash Exp (Free)' },
  { id: 'google/gemini-2.0-flash-lite-preview-02-05:free', name: 'Gemini 2.0 Flash Lite (Free)' },
  { id: 'google/gemini-2.0-pro-exp-02-05:free', name: 'Gemini 2.0 Pro Exp (Free)' },
  { id: 'google/gemini-1.5-pro-exp:free', name: 'Gemini 1.5 Pro Exp (Free)' },
  { id: 'google/gemini-1.5-flash:free', name: 'Gemini 1.5 Flash (Free)' },
  { id: 'google/gemini-1.5-flash-8b:free', name: 'Gemini 1.5 Flash 8B (Free)' },
  { id: 'google/gemini-exp-1206:free', name: 'Gemini Exp 1206 (Free)' },
  { id: 'google/gemini-exp-1121:free', name: 'Gemini Exp 1121 (Free)' },
  { id: 'google/gemini-exp-1114:free', name: 'Gemini Exp 1114 (Free)' },

  // Top Tier Other - Free
  { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B (Google - Free)' },
  { id: 'google/gemma-3-12b-it:free', name: 'Gemma 3 12B (Google - Free)' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (Meta - Free)' },
  { id: 'qwen/qwen3-next-80b-a3b-instruct:free', name: 'Qwen 3 80B (Free)' },
  { id: 'nousresearch/hermes-3-llama-3.1-405b:free', name: 'Hermes 3 405B (Free)' },

  // Mid Tier & Fast Models
  { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B (Google - Free)' },
  { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B (Free)' },
  { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Llama 3.2 3B (Free)' },
  { id: 'qwen/qwen3-coder:free', name: 'Qwen 3 Coder (Free)' },
  { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Free)' },
  
  // Auto-router / Last Resort
  { id: 'openrouter/free', name: 'OpenRouter Auto-Router (Free)' }
];

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function testConnection(apiKey: string, model: string): Promise<{ success: boolean; message: string }> {
  if (!apiKey) return { success: false, message: 'API Key is missing' };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Test connection' }],
        max_tokens: 10
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 401) return { success: false, message: 'Invalid API Key' };
    if (response.status === 429) return { success: false, message: 'Rate Limit Exceeded' };
    if (!response.ok) return { success: false, message: `Error: ${response.statusText}` };
    
    return { success: true, message: 'Connected successfully' };
  } catch (err: any) {
    if (err.name === 'AbortError') return { success: false, message: 'Connection timed out' };
    return { success: false, message: err.message || 'Connection failed' };
  }
}

// Adaptive temperature calculator — tunes creativity vs precision per question type
function getAdaptiveTemperature(userMessage: string): number {
  const msg = userMessage.toLowerCase().trim();

  // Pure factual/data lookup → very low temperature (precise, no hallucination risk)
  const isFactual =
    /^(berapa|apa|siapa|kapan|apakah|adakah|total|jumlah|rata.rata|how many|what is|which)/.test(msg) ||
    /(angka|nilai|jumlah|persentase|persen|total|count|number|amount)/.test(msg);

  // Analytical/comparison → moderate temperature (balanced)
  const isAnalytical =
    /(analisis|bandingkan|compare|tren|trend|pola|pattern|korelasi|correlation|anomali|anomaly)/.test(msg);

  // Recommendations/strategy → slightly higher (allow nuanced suggestions)
  const isStrategic =
    /(rekomendasi|recommend|strategi|strategy|peluang|opportunity|langkah|action|solusi|solution|saran|advice|bagaimana cara|how to|apa yang harus)/.test(msg);

  // Creative/executive summary → higher (richer narrative)
  const isNarrative =
    /(ringkasan|summary|ceritakan|jelaskan secara|gambaran|overview|insight keseluruhan|executive)/.test(msg);

  if (isFactual) return 0.1;      // ultra-precise
  if (isAnalytical) return 0.3;   // balanced analysis
  if (isStrategic) return 0.5;    // nuanced recommendations
  if (isNarrative) return 0.65;   // richer storytelling
  return 0.4;                     // safe default
}

// Adaptive token calculator — estimates token needs based on question type/complexity
function getAdaptiveTokens(userMessage: string): number {
  const msg = userMessage.toLowerCase().trim();
  const wordCount = msg.split(/\s+/).length;

  const isSimple =
    wordCount <= 6 ||
    /^(apa|siapa|berapa|kapan|di mana|mana|apakah|adakah)/.test(msg) ||
    /(jumlah|total|rata.rata|berapa|how many|what is|define|arti)/.test(msg);

  const isDeep =
    /(analisis|bandingkan|compare|jelaskan|explain|mengapa|kenapa|why|bagaimana|how|rekomendasi|recommend|strategi|strategy|tren|trend|peluang|opportunity|risiko|risk)/.test(msg) ||
    wordCount > 12;

  const isExecutive =
    /(executive|summary|ringkasan|keseluruhan|overall|insight|peluang strategis|quick win|jangka panjang)/.test(msg);

  if (isExecutive) return 1200;
  if (isDeep) return 900;
  if (isSimple) return 400;
  return 650;
}

export async function sendAIMessage(
  userMessage: string,
  contextData: string,
  apiKey: string,
  model: string,
  _temperature?: number, // ignored — use adaptive
  _maxTokens?: number    // ignored — use adaptive
): Promise<string> {
  if (!apiKey) {
    return "Error: No API key provided. Please configure your OpenRouter API key in settings.";
  }

  const adaptiveTemp = getAdaptiveTemperature(userMessage);
  const adaptiveTokens = getAdaptiveTokens(userMessage);

  const payload = {
    model,
    messages: [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\nDATA CONTEXT:\n${contextData}` },
      { role: 'user', content: userMessage }
    ],
    temperature: adaptiveTemp,
    max_tokens: adaptiveTokens,
  };

  return await fetchWithFallback(payload, apiKey);
}

async function fetchWithFallback(payload: any, apiKey: string): Promise<string> {
  const currentModel = payload.model;
  const freeModelIds = FREE_MODELS.map(m => m.id);
  
  // Filter out the selected model from fallbacks
  let otherModels = freeModelIds.filter(id => id !== currentModel);
  
  // Prioritas Fallback:
  // 1. Google Gemini 2.5 & 2.0 (Paling pintar)
  // 2. Google Gemini 1.5
  // 3. Google Gemma 3 27B 
  // 4. Llama 3.3 70B
  // 5. OpenRouter Auto-Router (Otomatis pilih yang available)
  const premiumFree = [
    'google/gemini-2.5-flash:free',
    'google/gemini-2.0-flash-exp:free',
    'google/gemini-2.0-pro-exp-02-05:free',
    'google/gemini-1.5-pro-exp:free',
    'google/gemini-1.5-flash:free',
    'google/gemini-exp-1206:free',
    'google/gemma-3-27b-it:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'openrouter/free'
  ];
  
  const priorityFallbacks = premiumFree.filter(id => otherModels.includes(id));
  const remainingFallbacks = otherModels.filter(id => !premiumFree.includes(id)).sort(() => Math.random() - 0.5);
  
  // Urutan Coba: Pilihan User -> Prioritas (Gemma/Llama/Auto) -> Sisanya (Acak)
  const modelsToTry = [currentModel, ...priorityFallbacks, ...remainingFallbacks];
  let lastErrorMsg = "";

  for (const model of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin || 'http://localhost:5173',
          'X-Title': 'Data Assistant',
        },
        body: JSON.stringify({ ...payload, model }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errDetails = response.statusText;
        try {
          const errBody = await response.json();
          if (errBody.error && errBody.error.message) {
            errDetails = errBody.error.message;
          }
        } catch(e) {}
        
        lastErrorMsg = `[${response.status}] ${errDetails}`;

        if (response.status === 401) throw new Error('Invalid API Key');
        
        // Rate limit (429) or Server issues (500+) -> Smart retry on next model
        if (response.status === 429 || response.status >= 500) {
          console.warn(`[${model}] failed (${response.status}), trying next fallback...`);
          continue;
        }
        
        console.warn(`Error on ${model}: ${errDetails}`);
        continue;
      }

      const result = await response.json();
      if (!result.choices || result.choices.length === 0) {
        lastErrorMsg = "No choices returned in API response.";
        continue;
      }
      return result.choices[0].message.content;
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        lastErrorMsg = "Connection timed out.";
        console.warn(`Timeout on ${model}, trying next fallback...`);
        continue;
      }
      if (err.message === 'Invalid API Key') {
        return "Error: Invalid API Key. Please check your settings.";
      }
      lastErrorMsg = err.message || "Unknown error";
      console.warn(`Failed with ${model}:`, err);
    }
  }

  return `Error: All fallback models failed. OpenRouter might be experiencing issues. Last error: ${lastErrorMsg}`;
}
