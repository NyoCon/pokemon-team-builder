#!/usr/bin/env node
/**
 * Fetches all PokeAPI data needed by the app and writes static JSON files to public/data/.
 * Run with: npm run fetch-data
 *
 * Output:
 *   public/data/pokemon.json  – PokemonSummary[]
 *   public/data/types.json    – { chart, typeNames }
 *   public/data/moves.json    – Record<id, MoveDetail>
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'data')
const BASE = 'https://pokeapi.co/api/v2'
const CONCURRENCY = 8

// Gen 4+ version groups — moves changed in these carry their Gen 3 power in past_values
const GEN4_PLUS_GROUPS = new Set([
  'diamond-pearl', 'platinum', 'heartgold-soulsilver',
  'black-white', 'black-2-white-2',
  'x-y', 'omega-ruby-alpha-sapphire',
  'sun-moon', 'ultra-sun-ultra-moon',
  'sword-shield', 'the-isle-of-armor', 'the-crown-tundra',
  'scarlet-violet',
])

const SUPPORTED_LANGS = ['de', 'en', 'fr', 'it', 'es']

// ── helpers ──────────────────────────────────────────────────────────────────

async function get(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

async function runBatched(items, fn) {
  const results = []
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY)
    const batchResults = await Promise.all(batch.map(fn))
    results.push(...batchResults)
    process.stdout.write(`\r  ${Math.min(i + CONCURRENCY, items.length)}/${items.length}`)
  }
  process.stdout.write('\n')
  return results
}

function extractNames(namesArr) {
  const result = {}
  for (const lang of SUPPORTED_LANGS) {
    const entry = namesArr.find(n => n.language.name === lang)
    result[lang] = entry?.name ?? ''
  }
  const en = result['en'] ?? ''
  for (const lang of SUPPORTED_LANGS) {
    if (!result[lang]) result[lang] = en
  }
  return result
}

// ── pokemon ──────────────────────────────────────────────────────────────────

async function fetchPokemon() {
  console.log('Fetching pokemon (1–251)...')
  const ids = Array.from({ length: 251 }, (_, i) => i + 1)
  const list = await runBatched(ids, async id => {
    const [pokemon, species] = await Promise.all([
      get(`${BASE}/pokemon/${id}`),
      get(`${BASE}/pokemon-species/${id}`),
    ])
    return {
      id,
      names: extractNames(species.names),
      types: pokemon.types.map(t => t.type.name),
      spriteUrl: pokemon.sprites.front_default ?? '',
    }
  })
  return list
}

// ── types ─────────────────────────────────────────────────────────────────────

async function fetchTypes() {
  console.log('Fetching types...')
  const typeListData = await get(`${BASE}/type?limit=20`)
  const slugs = typeListData.results
    .map(t => t.name)
    .filter(n => !['unknown', 'shadow'].includes(n))

  const chart = {}
  const typeNames = {}

  await runBatched(slugs, async name => {
    const data = await get(`${BASE}/type/${name}`)
    const dr = data.damage_relations
    chart[name] = {
      doubleDamageTo:   dr.double_damage_to.map(t => t.name),
      halfDamageTo:     dr.half_damage_to.map(t => t.name),
      noDamageTo:       dr.no_damage_to.map(t => t.name),
      doubleDamageFrom: dr.double_damage_from.map(t => t.name),
      halfDamageFrom:   dr.half_damage_from.map(t => t.name),
      noDamageFrom:     dr.no_damage_from.map(t => t.name),
    }
    const names = {}
    for (const entry of (data.names ?? [])) {
      if (SUPPORTED_LANGS.includes(entry.language.name)) {
        names[entry.language.name] = entry.name
      }
    }
    typeNames[name] = names
  })

  return { chart, typeNames }
}

// ── moves ─────────────────────────────────────────────────────────────────────

async function fetchMoves() {
  console.log('Fetching move list...')
  const listData = await get(`${BASE}/move?limit=354&offset=0`)
  const ids = listData.results
    .map(m => parseInt(m.url.split('/').filter(Boolean).pop()))
    .filter(id => id > 0 && id <= 354)

  console.log(`Fetching ${ids.length} move details...`)
  const moves = {}
  await runBatched(ids, async id => {
    const data = await get(`${BASE}/move/${id}`)
    const names = extractNames(data.names)
    let power = data.power ?? null
    if (Array.isArray(data.past_values)) {
      const gen3Era = data.past_values.find(
        pv => GEN4_PLUS_GROUPS.has(pv.version_group?.name) && pv.power != null
      )
      if (gen3Era) power = gen3Era.power
    }
    moves[id] = {
      id,
      names,
      type: data.type?.name ?? 'normal',
      power,
      pp: data.pp ?? null,
      accuracy: data.accuracy ?? null,
      damageClass: data.damage_class?.name ?? 'status',
    }
  })
  return moves
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  const [pokemon, types, moves] = await Promise.all([
    fetchPokemon(),
    fetchTypes(),
    fetchMoves(),
  ])

  writeFileSync(join(OUT_DIR, 'pokemon.json'), JSON.stringify(pokemon))
  writeFileSync(join(OUT_DIR, 'types.json'), JSON.stringify(types))
  writeFileSync(join(OUT_DIR, 'moves.json'), JSON.stringify(moves))

  const pokemonKb = Math.round(JSON.stringify(pokemon).length / 1024)
  const typesKb = Math.round(JSON.stringify(types).length / 1024)
  const movesKb = Math.round(JSON.stringify(moves).length / 1024)

  console.log(`\nDone! Written to public/data/`)
  console.log(`  pokemon.json  ${pokemonKb} KB`)
  console.log(`  types.json    ${typesKb} KB`)
  console.log(`  moves.json    ${movesKb} KB`)
}

main().catch(err => { console.error(err); process.exit(1) })
