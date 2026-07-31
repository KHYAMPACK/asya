export const copy = {
  brand: "Asya",
  welcomeLine: "sana küçük, tatlı bir şey hazırladım",
  start: "Başla",
  fakeName: {
    prompt: "Önce ismin ne?",
    placeholder: "ismini yaz…",
    submit: "Tamam",
  },
  nameReveal: ["Asya...", "İsmini biliyorum", "Merak etme 🥰", "Şimdi gerçek sorular..."],
  progress: (current: number, total: number) => `${current} / ${total}`,
  next: "Devam",
  doneTitle: "bitti ✨",
  doneBody: "cevapların bende. teşekkürler — yakında kahve mi?",
  submitting: "gönderiliyor…",
  submitError: "bir şeyler ters gitti, bir daha dener misin?",
  colorInit: ["Bir dakika...", "Hemen ayarlıyorum..."],
  musicPrep: {
    items: [
      {
        id: "volume",
        title: "Sesi aç",
        text: "Telefonunun sesini biraz yükselt",
      },
      {
        id: "silent",
        title: "Sessiz mod",
        text: "Titreşim / sessizdeyse kapat",
      },
    ],
    cta: "Hazırım",
  },
  carPlaylist: {
    prompt: "Arabada ne çalsın güzel kız?",
    add: "Ekle",
    skip: "Ekleme",
    playHint: "Başlatmak için play'e basman gerekebilir",
    progress: (n: number, target: number) => `${n} / ${target} eklendi`,
    done: "playlist hazır 🚗",
  },
  bgMusic: {
    label: "şu an çalan",
    playHint: "arka plan için play'e bas",
    skip: "Sonraki şarkı →",
  },
  activity: {
    prompt: "Buluşmada ne yapalım?",
  },
  flower: {
    prompt: "Favori çiçeğin hangisi?",
    gift: "Bu sadece dijital hali 😉",
    giftSub: "Artık çıkabilirsin",
  },
  beats: {
    playlist: ["Hemen playlisti oluşturuyorum...", "Tamam! 🎶"],
    place: [
      "En güzel yeri ayarlıyorum...",
      "Mekan doluymuş 😔",
      "Başka yer ayarladım 🤩",
    ],
  },
  gagFallback: [
    "yanlış cevap 😌",
    "bir daha dene…",
    "hayır butonu bozuldu",
    "öyle bir seçenek yok aslında",
    "evet'e kayıyorsun farkındaysan",
  ],
  answers: {
    title: "Cevaplar",
    subtitle: "sadece senin için",
    passwordLabel: "şifre",
    unlock: "Aç",
    empty: "henüz kimse cevaplamamış",
    wrongPassword: "şifre yanlış",
    noAttempts: (n: number) =>
      n === 0 ? "hayır denemedi 😇" : `${n} kez hayır denedi 👀`,
    loading: "yükleniyor…",
    refresh: "Yenile",
  },
} as const;
