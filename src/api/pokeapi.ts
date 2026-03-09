const BASE = 'https://pokeapi.co/api/v2'

async function cachedFetch<T>(key: string, url: string): Promise<T> {
  const stored = localStorage.getItem(key)
  if (stored) {
    try { return JSON.parse(stored) } catch { /* fall through */ }
  }
  const res = await fetch(url)
  if (!res.ok) throw new Error(`PokeAPI fetch failed: ${url} (${res.status})`)
  const data: T = await res.json()
  try { localStorage.setItem(key, JSON.stringify(data)) } catch { /* storage full */ }
  return data
}

export { cachedFetch, BASE }
