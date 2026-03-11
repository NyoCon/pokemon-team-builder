import type { Team, TeamSlot } from '../types'
import { EMPTY_SLOT } from '../types'
import { NATURES } from '../data/natures'

// nature index in URL: 0 = not set, 1–25 = NATURES[i-1]
function encodeNature(nature: string | undefined): number {
  if (!nature) return 0
  const idx = NATURES.findIndex(n => n.id === nature)
  return idx >= 0 ? idx + 1 : 0
}
function decodeNature(val: number): string | undefined {
  return val > 0 ? NATURES[val - 1]?.id : undefined
}

export function encodeTeam(team: Team): string {
  return team.slots
    .map(slot => {
      const pid = slot.pokemonId ?? 0
      const moves = slot.moveIds.map(m => m ?? 0).join('-')
      const nat = encodeNature(slot.nature)
      const evs = slot.evs
      const evPart = evs
        ? `${nat}-${evs.hp}-${evs.atk}-${evs.def}-${evs.spatk}-${evs.spdef}-${evs.spe}`
        : nat > 0 ? `${nat}-0-0-0-0-0-0` : ''
      return evPart ? `${pid}-${moves}-${evPart}` : `${pid}-${moves}`
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
    // extended format: 11 numbers (pid + 4 moves + nature + 6 EVs)
    const nature = nums.length >= 11 ? decodeNature(nums[5]) : undefined
    const evs = nums.length >= 11 ? {
      hp: nums[6], atk: nums[7], def: nums[8],
      spatk: nums[9], spdef: nums[10], spe: nums[11] ?? 0,
    } : undefined
    return { pokemonId, moveIds, nature, evs } as TeamSlot
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
