import type { PokemonSummary, MoveDetail, ItemDetail, TypeChart } from '../types'

// Module-level singletons — each file is fetched at most once per page session
let _pokemon: Promise<PokemonSummary[]> | null = null
let _types: Promise<{ chart: TypeChart; typeNames: Record<string, Record<string, string>> }> | null = null
let _moves: Promise<Record<number, MoveDetail>> | null = null
let _items: Promise<Record<string, ItemDetail>> | null = null
let _pokemonMoves: Promise<Record<number, number[]>> | null = null

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

export async function fetchAllItems(): Promise<Record<string, ItemDetail>> {
  if (!_items) _items = loadJson('items.json')
  return _items
}

export async function fetchItemDetail(slug: string): Promise<ItemDetail> {
  const items = await fetchAllItems()
  const item = items[slug]
  if (!item) throw new Error(`Item ${slug} not found in static data`)
  return item
}

export async function fetchAllPokemonMovesets(): Promise<Record<number, number[]>> {
  if (!_pokemonMoves) _pokemonMoves = loadJson('pokemon-moves.json')
  return _pokemonMoves
}

