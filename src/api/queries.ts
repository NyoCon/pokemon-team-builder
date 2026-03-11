import type { PokemonSummary, MoveDetail, ItemDetail, TypeChart } from '../types'
import { cachedFetch, BASE } from './pokeapi'

// Module-level singletons — each file is fetched at most once per page session
let _pokemon: Promise<PokemonSummary[]> | null = null
let _types: Promise<{ chart: TypeChart; typeNames: Record<string, Record<string, string>> }> | null = null
let _moves: Promise<Record<number, MoveDetail>> | null = null

function loadJson<T>(file: string): Promise<T> {
  const url = `${import.meta.env.BASE_URL}data/${file}`
  return fetch(url).then(r => {
    if (!r.ok) throw new Error(`Failed to load ${url}: ${r.status}`)
    return r.json()
  })
}

export function fetchAllPokemon(): Promise<PokemonSummary[]> {
  if (!_pokemon) _pokemon = loadJson('pokemon.json')
  return _pokemon
}

export function fetchAllTypes(): Promise<{ chart: TypeChart; typeNames: Record<string, Record<string, string>> }> {
  if (!_types) _types = loadJson('types.json')
  return _types
}

export async function fetchAllMoves(): Promise<Record<number, MoveDetail>> {
  if (!_moves) _moves = loadJson('moves.json')
  return _moves
}

export async function fetchAllMoveIds(): Promise<number[]> {
  const moves = await fetchAllMoves()
  return Object.keys(moves).map(Number)
}

export async function fetchMoveDetail(moveId: number): Promise<MoveDetail> {
  const moves = await fetchAllMoves()
  const move = moves[moveId]
  if (!move) throw new Error(`Move ${moveId} not found in static data`)
  return move
}

// Items are not in static data — still fetched from PokeAPI (few in number, tiny footprint)
export async function fetchItemDetail(slug: string): Promise<ItemDetail> {
  const data = await cachedFetch<any>(`poke:item:${slug}`, `${BASE}/item/${slug}`)
  const names = extractNames(data.names)
  const spriteUrl: string | null = data.sprites?.default ?? null
  return { slug, names, spriteUrl }
}

// kept for potential future use (playthrough branch)
export async function fetchPokemonMoves(_pokemonId: number): Promise<number[]> {
  return fetchAllMoveIds()
}

// ── helpers ───────────────────────────────────────────────────────────────────

const SUPPORTED_LANGS = ['de', 'en', 'fr', 'it', 'es'] as const

function extractNames(namesArr: Array<{ name: string; language: { name: string } }>) {
  const result: Record<string, string> = {}
  for (const lang of SUPPORTED_LANGS) {
    const entry = namesArr.find(n => n.language.name === lang)
    result[lang] = entry?.name ?? ''
  }
  const en = result['en'] ?? ''
  for (const lang of SUPPORTED_LANGS) {
    if (!result[lang]) result[lang] = en
  }
  return result as { de: string; en: string; fr: string; it: string; es: string }
}
