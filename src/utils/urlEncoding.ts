import type { Team, TeamSlot } from '../types'
import { EMPTY_SLOT } from '../types'
import { NATURES } from '../data/natures'
import { FRLG_ITEM_SLUGS } from '../data/items'

// nature index in URL: 0 = not set, 1–25 = NATURES[i-1]
function encodeNature(nature: string | undefined): number {
  if (!nature) return 0
  const idx = NATURES.findIndex(n => n.id === nature)
  return idx >= 0 ? idx + 1 : 0
}
function decodeNature(val: number): string | undefined {
  return val > 0 ? NATURES[val - 1]?.id : undefined
}

// item index in URL: 0 = not set, 1–N = FRLG_ITEM_SLUGS[i-1]
function encodeItem(item: string | undefined): number {
  if (!item) return 0
  const idx = FRLG_ITEM_SLUGS.indexOf(item)
  return idx >= 0 ? idx + 1 : 0
}
function decodeItem(val: number): string | undefined {
  return val > 0 ? FRLG_ITEM_SLUGS[val - 1] : undefined
}

export function encodeTeam(team: Team): string {
  return team.slots
    .map(slot => {
      const pid = slot.pokemonId ?? 0
      const moves = slot.moveIds.map(m => m ?? 0).join('-')
      const nat = encodeNature(slot.nature)
      const evs = slot.evs
      const itm = encodeItem(slot.item)
      const hasAdvanced = nat > 0 || evs != null || itm > 0
      if (!hasAdvanced) return `${pid}-${moves}`
      const evPart = evs ? `${evs.hp}-${evs.atk}-${evs.def}-${evs.spatk}-${evs.spdef}-${evs.spe}` : '0-0-0-0-0-0'
      return `${pid}-${moves}-${nat}-${evPart}-${itm}`
    })
    .join('_')
}

export function decodeTeam(encoded: string): Team {
  const parts = encoded.split('_')
  const slots = parts.slice(0, 6).map(part => {
    const nums = part.split('-').map(Number)
    const pokemonId = nums[0] || null
    const moveIds: [number | null, number | null, number | null, number | null] = [
      nums[1] || null,
      nums[2] || null,
      nums[3] || null,
      nums[4] || null,
    ]
    // extended format: 12 numbers (pid + 4 moves + nature + 6 EVs + item)
    const nature = nums.length >= 12 ? decodeNature(nums[5]) : undefined
    const evs = nums.length >= 12 ? {
      hp: nums[6], atk: nums[7], def: nums[8],
      spatk: nums[9], spdef: nums[10], spe: nums[11],
    } : undefined
    const item = nums.length >= 12 ? decodeItem(nums[12] ?? 0) : undefined
    return { pokemonId, moveIds, nature, evs, item } as TeamSlot
  })

  while (slots.length < 6) {
    slots.push({ ...EMPTY_SLOT, moveIds: [null, null, null, null] })
  }

  return { slots: slots as Team['slots'] }
}

export function getShareUrl(team: Team): string {
  const encoded = encodeTeam(team)
  const url = new URL(window.location.href)
  url.searchParams.set('team', encoded)
  return url.toString()
}

export function readTeamFromUrl(): Team | null {
  const params = new URLSearchParams(window.location.search)
  const encoded = params.get('team')
  if (!encoded) return null
  try {
    return decodeTeam(encoded)
  } catch {
    return null
  }
}
