export type Lang = 'de' | 'en' | 'fr' | 'it' | 'es'

export interface LocalizedName {
  de: string
  en: string
  fr: string
  it: string
  es: string
}

export interface PokemonType {
  name: string // english slug e.g. "fire"
  names: LocalizedName
}

export interface PokemonSummary {
  id: number
  names: LocalizedName
  types: string[] // english slugs
  spriteUrl: string
}

export interface MoveDetail {
  id: number
  names: LocalizedName
  type: string // english slug
  power: number | null
  pp: number | null
  accuracy: number | null
  damageClass: 'physical' | 'special' | 'status'
}

export interface TypeChart {
  [typeName: string]: {
    doubleDamageTo: string[]
    halfDamageTo: string[]
    noDamageTo: string[]
    doubleDamageFrom: string[]
    halfDamageFrom: string[]
    noDamageFrom: string[]
  }
}

export interface TeamSlot {
  pokemonId: number | null
  moveIds: [number | null, number | null, number | null, number | null]
}

export const EMPTY_SLOT: TeamSlot = {
  pokemonId: null,
  moveIds: [null, null, null, null],
}

export interface Team {
  slots: [TeamSlot, TeamSlot, TeamSlot, TeamSlot, TeamSlot, TeamSlot]
}

export const EMPTY_TEAM: Team = {
  slots: [
    { ...EMPTY_SLOT, moveIds: [null, null, null, null] },
    { ...EMPTY_SLOT, moveIds: [null, null, null, null] },
    { ...EMPTY_SLOT, moveIds: [null, null, null, null] },
    { ...EMPTY_SLOT, moveIds: [null, null, null, null] },
    { ...EMPTY_SLOT, moveIds: [null, null, null, null] },
    { ...EMPTY_SLOT, moveIds: [null, null, null, null] },
  ],
}

export type EffectivenessMultiplier = 0 | 0.25 | 0.5 | 1 | 2 | 4
