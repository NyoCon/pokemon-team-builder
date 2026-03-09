import { cachedFetch, BASE } from './pokeapi'
import type { PokemonSummary, MoveDetail, TypeChart, LocalizedName } from '../types'

const SUPPORTED_LANGS: (keyof LocalizedName)[] = ['de', 'en', 'fr', 'it', 'es']

function extractNames(namesArr: Array<{ name: string; language: { name: string } }>): LocalizedName {
  const result: Partial<LocalizedName> = {}
  for (const lang of SUPPORTED_LANGS) {
    const entry = namesArr.find(n => n.language.name === lang)
    result[lang] = entry?.name ?? ''
  }
  // fill missing with english fallback
  const en = result['en'] ?? ''
  for (const lang of SUPPORTED_LANGS) {
    if (!result[lang]) result[lang] = en
  }
  return result as LocalizedName
}

export async function fetchAllPokemon(): Promise<PokemonSummary[]> {
  const cacheKey = 'poke:list:frlg'
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    try { return JSON.parse(cached) } catch { /* fall through */ }
  }

  // FR/LG pokedex: pokemon 1-151
  const ids = Array.from({ length: 151 }, (_, i) => i + 1)

  const results = await Promise.all(
    ids.map(async id => {
      const [pokemon, species] = await Promise.all([
        cachedFetch<any>(`poke:pokemon:${id}`, `${BASE}/pokemon/${id}`),
        cachedFetch<any>(`poke:species:${id}`, `${BASE}/pokemon-species/${id}`),
      ])

      const names = extractNames(species.names)
      const types: string[] = pokemon.types.map((t: any) => t.type.name)
      const spriteUrl: string =
        pokemon.sprites.front_default ?? ''

      return { id, names, types, spriteUrl } as PokemonSummary
    })
  )

  try { localStorage.setItem(cacheKey, JSON.stringify(results)) } catch { /* storage full */ }
  return results
}

export async function fetchPokemonMoves(pokemonId: number): Promise<number[]> {
  const cacheKey = `poke:moves:${pokemonId}`
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    try { return JSON.parse(cached) } catch { /* fall through */ }
  }

  const data = await cachedFetch<any>(`poke:pokemon:${pokemonId}`, `${BASE}/pokemon/${pokemonId}`)

  // FR/LG is a remake of Red/Blue/Yellow — PokeAPI sometimes only lists moves under the
  // original Gen 1 version groups rather than duplicating them under firered-leafgreen.
  // Include all Gen 1–3 groups that are valid in FR/LG context.
  const FRLG_GROUPS = new Set([
    'firered-leafgreen',
    'red-blue', 'yellow',          // Gen 1 originals (FR/LG remakes these)
    'gold-silver', 'crystal',      // Gen 2 (move tutors, etc. carried over)
    'ruby-sapphire', 'emerald',    // Gen 3 siblings (share TM pool largely)
  ])

  const moveIds: number[] = []
  for (const m of data.moves) {
    const hasFRLG = m.version_group_details.some(
      (vgd: any) => FRLG_GROUPS.has(vgd.version_group.name)
    )
    if (hasFRLG) {
      const id = parseInt(m.move.url.split('/').filter(Boolean).pop() ?? '0')
      if (id > 0) moveIds.push(id)
    }
  }

  try { localStorage.setItem(cacheKey, JSON.stringify(moveIds)) } catch { /* storage full */ }
  return moveIds
}

export async function fetchMoveDetail(moveId: number): Promise<MoveDetail> {
  const data = await cachedFetch<any>(`poke:move:${moveId}`, `${BASE}/move/${moveId}`)

  const names = extractNames(data.names)
  const typeId = data.type?.name ?? 'normal'
  const power: number | null = data.power ?? null
  const pp: number | null = data.pp ?? null
  const accuracy: number | null = data.accuracy ?? null
  const damageClass: MoveDetail['damageClass'] = data.damage_class?.name ?? 'status'

  return { id: moveId, names, type: typeId, power, pp, accuracy, damageClass }
}

export async function fetchAllTypes(): Promise<{
  chart: TypeChart
  typeNames: Record<string, Record<string, string>>
}> {
  const typeListData = await cachedFetch<any>('poke:type:list', `${BASE}/type?limit=20`)
  const slugs: string[] = typeListData.results
    .map((t: any) => t.name)
    .filter((n: string) => !['unknown', 'shadow'].includes(n))

  const chart: TypeChart = {}
  const typeNames: Record<string, Record<string, string>> = {}

  await Promise.all(
    slugs.map(async name => {
      const data = await cachedFetch<any>(`poke:type:${name}`, `${BASE}/type/${name}`)
      const dr = data.damage_relations
      chart[name] = {
        doubleDamageTo: dr.double_damage_to.map((t: any) => t.name),
        halfDamageTo: dr.half_damage_to.map((t: any) => t.name),
        noDamageTo: dr.no_damage_to.map((t: any) => t.name),
        doubleDamageFrom: dr.double_damage_from.map((t: any) => t.name),
        halfDamageFrom: dr.half_damage_from.map((t: any) => t.name),
        noDamageFrom: dr.no_damage_from.map((t: any) => t.name),
      }
      // Extract localized names directly from in-memory API response
      const names: Record<string, string> = {}
      for (const entry of (data.names ?? [])) {
        if (['de', 'en', 'fr', 'it', 'es'].includes(entry.language.name)) {
          names[entry.language.name] = entry.name
        }
      }
      typeNames[name] = names
    })
  )

  try { localStorage.setItem('poke:typechart', JSON.stringify(chart)) } catch { /* storage full */ }
  return { chart, typeNames }
}

// All move IDs up to Gen 3 (FR/LG era = moves 1–354)
export async function fetchAllMoveIds(): Promise<number[]> {
  const cacheKey = 'poke:all-move-ids'
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    try { return JSON.parse(cached) } catch { /* fall through */ }
  }

  const data = await cachedFetch<any>(cacheKey, `${BASE}/move?limit=354&offset=0`)
  const ids: number[] = data.results.map((m: any) => {
    const parts = m.url.split('/').filter(Boolean)
    return parseInt(parts[parts.length - 1])
  }).filter((id: number) => id > 0 && id <= 354)

  try { localStorage.setItem(cacheKey, JSON.stringify(ids)) } catch { /* storage full */ }
  return ids
}

export async function fetchTypeName(typeName: string): Promise<LocalizedName> {
  const data = await cachedFetch<any>(`poke:type:${typeName}`, `${BASE}/type/${typeName}`)
  return extractNames(data.names)
}
