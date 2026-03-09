import type { Team, TeamSlot } from '../types'
import { EMPTY_SLOT } from '../types'

export function encodeTeam(team: Team): string {
  return team.slots
    .map(slot => {
      const pid = slot.pokemonId ?? 0
      const moves = slot.moveIds.map(m => m ?? 0).join('-')
      return `${pid}-${moves}`
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
    return { pokemonId, moveIds } as TeamSlot
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
