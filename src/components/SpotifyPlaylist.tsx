import { asyaPlaylist } from "@/lib/spotify";

type Props = {
  title?: string;
};

export function SpotifyPlaylist({ title }: Props) {
  return (
    <div className="spotify-wrap">
      {title && <p className="spotify-hint">{title}</p>}
      <iframe
        className="spotify-embed"
        title="Asya playlist"
        src={asyaPlaylist.embedUrl}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
