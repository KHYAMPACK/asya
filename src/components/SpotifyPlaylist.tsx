import { sevvalPlaylist } from "@/lib/spotify";

type Props = {
  title?: string;
};

export function SpotifyPlaylist({ title }: Props) {
  return (
    <div className="spotify-wrap">
      {title && <p className="spotify-hint">{title}</p>}
      <iframe
        className="spotify-embed"
        title="Şevval playlist"
        src={sevvalPlaylist.embedUrl}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
