const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const TOP_URL   = 'https://api.spotify.com/v1/me/top'

async function getAccessToken(): Promise<string> {
  const id     = process.env.SPOTIFY_CLIENT_ID!
  const secret = process.env.SPOTIFY_CLIENT_SECRET!
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN!

  const basic = Buffer.from(`${id}:${secret}`).toString('base64')
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
    cache: 'no-store',
  })
  const data = await res.json()
  return data.access_token as string
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string }[]
  album: { name: string; images: { url: string }[] }
  external_urls: { spotify: string }
}

export interface SpotifyArtist {
  id: string
  name: string
  images: { url: string }[]
  external_urls: { spotify: string }
  genres: string[]
}

export async function getTopSpotifyItems(): Promise<{
  tracks: SpotifyTrack[]
  artists: SpotifyArtist[]
} | null> {
  try {
    const token = await getAccessToken()
    const headers = { Authorization: `Bearer ${token}` }

    const [tracksRes, artistsRes] = await Promise.all([
      fetch(`${TOP_URL}/tracks?limit=5&time_range=short_term`, { headers, next: { revalidate: 3600 } }),
      fetch(`${TOP_URL}/artists?limit=5&time_range=short_term`, { headers, next: { revalidate: 3600 } }),
    ])

    if (!tracksRes.ok || !artistsRes.ok) return null

    const [tracksData, artistsData] = await Promise.all([tracksRes.json(), artistsRes.json()])
    return { tracks: tracksData.items, artists: artistsData.items }
  } catch {
    return null
  }
}
