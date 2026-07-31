import { copy } from "@/lib/copy";
import { trackEmbedUrl, type CarSong } from "@/lib/carSongs";

type Props = {
  song: CarSong;
  onSkip: () => void;
};

export function ActivityMusic({ song, onSkip }: Props) {
  if (!song.trackId) return null;

  return (
    <div className="activity-music">
      <div className="activity-music-top">
        <p className="activity-music-label">{copy.bgMusic.label}</p>
        <button type="button" className="song-skip-btn" onClick={onSkip}>
          {copy.bgMusic.skip}
        </button>
      </div>
      <iframe
        key={song.trackId}
        className="spotify-track-embed"
        title={song.title}
        src={`${trackEmbedUrl(song.trackId)}&autoplay=1`}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    </div>
  );
}
