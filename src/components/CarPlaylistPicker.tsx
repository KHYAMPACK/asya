"use client";

import { useEffect, useMemo, useState } from "react";
import { copy } from "@/lib/copy";
import {
  CAR_PLAYLIST_TARGET,
  carSongs,
  shuffleSongs,
  trackEmbedUrl,
  type CarSong,
} from "@/lib/carSongs";

type Props = {
  onComplete: (picked: CarSong[]) => void;
  onTrackChange: (song: CarSong) => void;
};

type FlyDir = "left" | "right" | null;

export function CarPlaylistPicker({ onComplete, onTrackChange }: Props) {
  const deck = useMemo(() => shuffleSongs(carSongs), []);
  const [songIndex, setSongIndex] = useState(0);
  const [picked, setPicked] = useState<CarSong[]>([]);
  const [fly, setFly] = useState<FlyDir>(null);
  const [busy, setBusy] = useState(false);

  const song = deck[songIndex];
  const added = picked.length;
  const done = added >= CAR_PLAYLIST_TARGET;

  useEffect(() => {
    if (song) onTrackChange(song);
  }, [song, onTrackChange]);

  function decide(add: boolean) {
    if (!song || done || busy) return;
    setBusy(true);
    setFly(add ? "right" : "left");

    const nextPicked = add ? [...picked, song] : picked;

    window.setTimeout(() => {
      if (add) setPicked(nextPicked);

      if (nextPicked.length >= CAR_PLAYLIST_TARGET) {
        onComplete(nextPicked);
        return;
      }

      if (songIndex >= deck.length - 1) {
        onComplete(nextPicked);
        return;
      }

      setSongIndex((i) => i + 1);
      setFly(null);
      setBusy(false);
    }, 320);
  }

  if (!song) {
    return null;
  }

  return (
    <section className="panel car-playlist enter">
      <p className="car-progress">
        {copy.carPlaylist.progress(added, CAR_PLAYLIST_TARGET)}
      </p>
      <h2 className="prompt car-prompt">{copy.carPlaylist.prompt}</h2>

      <div className="tinder-deck" aria-live="polite">
        <div
          className={`song-card song-card-front ${fly === "left" ? "fly-left" : ""} ${fly === "right" ? "fly-right" : ""}`}
          key={song.id}
        >
          <div className="song-meta">
            <p className="song-title">{song.title}</p>
            {song.artist ? <p className="song-artist">{song.artist}</p> : null}
          </div>
          {song.trackId && (
            <>
              <iframe
                className="spotify-track-embed"
                title={song.title}
                src={`${trackEmbedUrl(song.trackId)}&autoplay=1`}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
              <p className="play-hint">
                <span>{copy.carPlaylist.playHint}</span>
                <span className="play-hint-arrow" aria-hidden>
                  ↗
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      <div className="tinder-actions">
        <button
          type="button"
          className="tinder-btn tinder-no"
          aria-label={copy.carPlaylist.skip}
          disabled={busy}
          onClick={() => decide(false)}
        >
          <span aria-hidden>×</span>
        </button>
        <button
          type="button"
          className="tinder-btn tinder-yes"
          aria-label={copy.carPlaylist.add}
          disabled={busy}
          onClick={() => decide(true)}
        >
          <span aria-hidden>+</span>
        </button>
      </div>
    </section>
  );
}
