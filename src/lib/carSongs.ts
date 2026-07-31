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
  { id: "6d67Xv8ms2noA8wWFLiPDN", title: "Twilight", artist: "", trackId: "6d67Xv8ms2noA8wWFLiPDN" },
  { id: "42qNWdLKCI41S4uzfamhFM", title: "Duvet", artist: "", trackId: "42qNWdLKCI41S4uzfamhFM" },
  { id: "6GDd1lZ0zp5pB6JleN5Xzx", title: "California", artist: "", trackId: "6GDd1lZ0zp5pB6JleN5Xzx" },
  { id: "56NEihhw1BsIgBBzfvcE76", title: "Bags", artist: "", trackId: "56NEihhw1BsIgBBzfvcE76" },
  { id: "57VAuR1WgKFzcpO3ujQx9A", title: "Harbor", artist: "", trackId: "57VAuR1WgKFzcpO3ujQx9A" },
  { id: "6okfc9cxb2svHFgrqtFPG6", title: "Trying", artist: "", trackId: "6okfc9cxb2svHFgrqtFPG6" },
  { id: "7EAMXbLcL0qXmciM5SwMh2", title: "Heart To Heart", artist: "", trackId: "7EAMXbLcL0qXmciM5SwMh2" },
  { id: "2R4AlwtrrkMaRKojcTIzmL", title: "For the First Time", artist: "", trackId: "2R4AlwtrrkMaRKojcTIzmL" },
  { id: "6jgkEbmQ2F2onEqsEhiliL", title: "My Kind of Woman", artist: "", trackId: "6jgkEbmQ2F2onEqsEhiliL" },
  { id: "2QzKAF0y1BQhxwg8N05Uog", title: "Watching Him Fade Away", artist: "", trackId: "2QzKAF0y1BQhxwg8N05Uog" },
  { id: "7asyVbwQE7IbA3x2be7bdI", title: "Fool", artist: "", trackId: "7asyVbwQE7IbA3x2be7bdI" },
  { id: "0oS6978exXanyIZJD4cdgV", title: "1999", artist: "", trackId: "0oS6978exXanyIZJD4cdgV" },
  { id: "43iIQbw5hx986dUEZbr3eN", title: "From The Start", artist: "", trackId: "43iIQbw5hx986dUEZbr3eN" },
  { id: "3ISKxnCGKc5B9zr9CTUB3v", title: "Bags - Recorded At Electric Lady Studios", artist: "", trackId: "3ISKxnCGKc5B9zr9CTUB3v" },
  { id: "0KyAGiNGUytG5JLxJu4F6l", title: "Pretty Girl", artist: "", trackId: "0KyAGiNGUytG5JLxJu4F6l" },
  { id: "34q8siON3Dxf5HFVt3pynf", title: "Blouse", artist: "", trackId: "34q8siON3Dxf5HFVt3pynf" },
  { id: "0OpC8hRrbsh24taKOsQBEX", title: "Real Man", artist: "", trackId: "0OpC8hRrbsh24taKOsQBEX" },
  { id: "1AMADyXgIWayh5vXLZo2qF", title: "Covet", artist: "", trackId: "1AMADyXgIWayh5vXLZo2qF" },
  { id: "0z1o5L7HJx562xZSATcIpY", title: "Exit Music (For A Film)", artist: "", trackId: "0z1o5L7HJx562xZSATcIpY" },
  { id: "2ctvdKmETyOzPb2GiJJT53", title: "Breathe (In the Air)", artist: "", trackId: "2ctvdKmETyOzPb2GiJJT53" },
  { id: "0Ot6e3wYVQQ1Us9PM977jE", title: "A Little Death", artist: "", trackId: "0Ot6e3wYVQQ1Us9PM977jE" },
  { id: "709ZIqPHyFOpx2QdjmeWAM", title: "Dracula", artist: "", trackId: "709ZIqPHyFOpx2QdjmeWAM" },
  { id: "46eHxWRKmtYhUHPDRgclt6", title: "Careless Whisper", artist: "", trackId: "46eHxWRKmtYhUHPDRgclt6" },
  { id: "4eAwB5pnKFTmsgc3zWoYO0", title: "Fake It", artist: "", trackId: "4eAwB5pnKFTmsgc3zWoYO0" },
  { id: "4eTIe5eqds88bA9ua6p5p6", title: "Fine Again", artist: "", trackId: "4eTIe5eqds88bA9ua6p5p6" },
];

export const CAR_PLAYLIST_TARGET = 5;

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
