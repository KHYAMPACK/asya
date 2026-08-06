export type CarSong = {
  id: string;
  title: string;
  artist: string;
  /** Spotify track id (22 chars) — enables in-page preview player */
  trackId?: string;
};

/**
 * Songs offered for “arabaya ekle”.
 * Order is shuffled at runtime in the picker.
 */
export const carSongs: CarSong[] = [
  { id: "1j0hYAYyxLPst8rTS2O3Hd", title: "2 Tas Çorba - Sıcak Versiyon", artist: "", trackId: "1j0hYAYyxLPst8rTS2O3Hd" },
  { id: "1jH3jM3CqPmZcX7gzVPLHb", title: "Çakkıdı", artist: "", trackId: "1jH3jM3CqPmZcX7gzVPLHb" },
  { id: "08aV6QNL1GtSDTplVs4pFf", title: "Re", artist: "", trackId: "08aV6QNL1GtSDTplVs4pFf" },
  { id: "7no46t2pn0kU6Htr8yfWtZ", title: "Kargalar", artist: "", trackId: "7no46t2pn0kU6Htr8yfWtZ" },
  { id: "38SZCSmXZJDoaEf0YjQQv6", title: "Ölüyorum", artist: "", trackId: "38SZCSmXZJDoaEf0YjQQv6" },
  { id: "0tvVGyUUocv1yfpXIAzcTc", title: "Askina Elveda", artist: "", trackId: "0tvVGyUUocv1yfpXIAzcTc" },
  { id: "0RoQ5sk1Z9PH2xki3gv5hO", title: "Değmesin Ellerimiz", artist: "", trackId: "0RoQ5sk1Z9PH2xki3gv5hO" },
  { id: "32d2UJY7JVyw96rZFw1g2S", title: "Dans Et", artist: "", trackId: "32d2UJY7JVyw96rZFw1g2S" },
  { id: "5Y5K8lKCzMRSLDOqm8s2qq", title: "Prensesin Uykusuyum", artist: "", trackId: "5Y5K8lKCzMRSLDOqm8s2qq" },
  { id: "3GXkYMKJ443tsH5KmOABnw", title: "Cesaretsizce Olmuyor", artist: "", trackId: "3GXkYMKJ443tsH5KmOABnw" },
];

export const CAR_PLAYLIST_TARGET = 3;

export function trackEmbedUrl(trackId: string) {
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
}

export function shuffleSongs<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}
