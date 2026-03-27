import { getTopSpotifyItems } from '@/lib/spotify'
import type { SpotifyTrack, SpotifyArtist } from '@/lib/spotify'
import Image from 'next/image'

function SpotifyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )
}

function TrackRow({ track, rank }: { track: SpotifyTrack; rank: number }) {
  const img = track.album.images[2]?.url ?? track.album.images[0]?.url
  const artists = track.artists.map(a => a.name).join(', ')
  return (
    <a
      href={track.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="spotify-row flex items-center gap-2 py-1.5 px-2 rounded-lg"
    >
      <span className="font-inter text-xs w-4 text-right shrink-0" style={{ color: 'var(--accent-primary)', opacity: 0.6 }}>
        {rank}
      </span>
      {img && (
        <Image src={img} alt={track.album.name} width={36} height={36} className="rounded shrink-0" style={{ objectFit: 'cover' }} />
      )}
      <div className="min-w-0">
        <p className="font-inter text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{track.name}</p>
        <p className="font-inter text-xs truncate" style={{ color: 'var(--text-muted)' }}>{artists}</p>
      </div>
    </a>
  )
}

function ArtistRow({ artist, rank }: { artist: SpotifyArtist; rank: number }) {
  const img = artist.images[2]?.url ?? artist.images[0]?.url
  const genre = artist.genres?.[0] ?? ''
  return (
    <a
      href={artist.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="spotify-row flex items-center gap-2 py-1.5 px-2 rounded-lg"
    >
      <span className="font-inter text-xs w-4 text-right shrink-0" style={{ color: 'var(--accent-primary)', opacity: 0.6 }}>
        {rank}
      </span>
      {img && (
        <Image src={img} alt={artist.name} width={36} height={36} className="rounded-full shrink-0" style={{ objectFit: 'cover' }} />
      )}
      <div className="min-w-0">
        <p className="font-inter text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{artist.name}</p>
        {genre && <p className="font-inter text-xs truncate capitalize" style={{ color: 'var(--text-muted)' }}>{genre}</p>}
      </div>
    </a>
  )
}

export default async function SpotifyStats() {
  const data = await getTopSpotifyItems()
  if (!data) return null

  return (
    <div className="w-full mt-8 rounded-2xl p-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--accent-primary)' }}>
        <SpotifyIcon />
        <p className="font-inter text-xs font-bold tracking-widest uppercase">Listening To</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="font-inter text-xs font-semibold uppercase tracking-wider mb-1 px-2" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
            Top Tracks
          </p>
          <div className="flex flex-col">
            {data.tracks.map((track, i) => (
              <TrackRow key={track.id} track={track} rank={i + 1} />
            ))}
          </div>
        </div>

        <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '0.75rem' }}>
          <p className="font-inter text-xs font-semibold uppercase tracking-wider mb-1 px-2" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
            Top Artists
          </p>
          <div className="flex flex-col">
            {data.artists.map((artist, i) => (
              <ArtistRow key={artist.id} artist={artist} rank={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
