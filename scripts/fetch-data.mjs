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

const FRLG_GROUPS = new Set([
  'firered-leafgreen',
  'red-blue', 'yellow',
  'gold-silver', 'crystal',
  'ruby-sapphire', 'emerald',
])

const LEARNABLE_METHODS = new Set(['level-up', 'machine', 'egg'])

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
  const pokemon = new Array(ids.length)
  const pokemonMoves = {}

  await runBatched(ids, async id => {
    const [poke, species] = await Promise.all([
      get(`${BASE}/pokemon/${id}`),
      get(`${BASE}/pokemon-species/${id}`),
    ])
    pokemon[id - 1] = {
      id,
      names: extractNames(species.names),
      types: poke.types.map(t => t.type.name),
      spriteUrl: poke.sprites.front_default ?? '',
    }
    // Extract FRLG-learnable move IDs (level-up + machine + egg)
    const learnableIds = []
    for (const m of poke.moves) {
      const isLearnable = m.version_group_details.some(
        vgd => FRLG_GROUPS.has(vgd.version_group.name) && LEARNABLE_METHODS.has(vgd.move_learn_method.name)
      )
      if (isLearnable) {
        const moveId = parseInt(m.move.url.split('/').filter(Boolean).pop() ?? '0')
        if (moveId > 0) learnableIds.push(moveId)
      }
    }
    pokemonMoves[id] = learnableIds
  })

  return { pokemon, pokemonMoves }
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

// ── items ─────────────────────────────────────────────────────────────────────

// Must stay in sync with src/data/items.ts (order matters for URL encoding)
const FRLG_ITEM_SLUGS = [
  'silk-scarf','charcoal','mystic-water','miracle-seed','never-melt-ice','magnet',
  'twisted-spoon','black-belt','sharp-beak','poison-barb','soft-sand','hard-stone',
  'silver-powder','spell-tag','metal-coat','dragon-fang','black-glasses',
  'leftovers','shell-bell','lum-berry','sitrus-berry','kings-rock','scope-lens',
  'choice-band','focus-band','quick-claw','bright-powder','white-herb',
  'macho-brace','exp-share','amulet-coin','smoke-ball','everstone',
  'sacred-ash','nugget','pp-up','pp-max','full-restore','max-potion',
  'full-heal','max-revive','max-elixir','max-ether','fluffy-tail',
  'repel','super-repel','max-repel','old-amber','helix-fossil','dome-fossil',
  'lucky-egg','stick',
]

async function fetchItems() {
  console.log(`Fetching ${FRLG_ITEM_SLUGS.length} item details...`)
  const items = {}
  await runBatched(FRLG_ITEM_SLUGS, async slug => {
    const data = await get(`${BASE}/item/${slug}`)
    items[slug] = {
      slug,
      names: extractNames(data.names),
      spriteUrl: data.sprites?.default ?? null,
    }
  })
  return items
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  const [{ pokemon, pokemonMoves }, types, moves, items] = await Promise.all([
    fetchPokemon(),
    fetchTypes(),
    fetchMoves(),
    fetchItems(),
  ])

  writeFileSync(join(OUT_DIR, 'pokemon.json'), JSON.stringify(pokemon))
  writeFileSync(join(OUT_DIR, 'types.json'), JSON.stringify(types))
  writeFileSync(join(OUT_DIR, 'moves.json'), JSON.stringify(moves))
  writeFileSync(join(OUT_DIR, 'items.json'), JSON.stringify(items))
  writeFileSync(join(OUT_DIR, 'pokemon-moves.json'), JSON.stringify(pokemonMoves))

  console.log(`\nDone! Written to public/data/`)
  console.log(`  pokemon.json        ${Math.round(JSON.stringify(pokemon).length / 1024)} KB`)
  console.log(`  types.json          ${Math.round(JSON.stringify(types).length / 1024)} KB`)
  console.log(`  moves.json          ${Math.round(JSON.stringify(moves).length / 1024)} KB`)
  console.log(`  items.json          ${Math.round(JSON.stringify(items).length / 1024)} KB`)
  console.log(`  pokemon-moves.json  ${Math.round(JSON.stringify(pokemonMoves).length / 1024)} KB`)
}

main().catch(err => { console.error(err); process.exit(1) })
