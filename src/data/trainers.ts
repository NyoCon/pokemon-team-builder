import type { Lang } from '../types'

export interface Trainer {
  id: string
  names: Record<Lang, string>
  group: 'gym' | 'elite4' | 'elite4-rematch'
  pokemonIds: number[]
}

// FireRed / LeafGreen — Gym Leaders & Elite Four
// Pokemon IDs: National Dex numbers (all within 1–151)
export const TRAINERS: Trainer[] = [
  // ── Gym Leaders ────────────────────────────────────────────────
  {
    id: 'brock',
    names: { en: 'Brock', de: 'Rocko', fr: 'Pierre', it: 'Brock', es: 'Brock' },
    group: 'gym',
    pokemonIds: [74, 95], // Geodude, Onix
  },
  {
    id: 'misty',
    names: { en: 'Misty', de: 'Misty', fr: 'Ondine', it: 'Misty', es: 'Misty' },
    group: 'gym',
    pokemonIds: [120, 121], // Staryu, Starmie
  },
  {
    id: 'surge',
    names: { en: 'Lt. Surge', de: 'Major Bob', fr: 'Major Bob', it: 'Gt. Surge', es: 'Cte. Surge' },
    group: 'gym',
    pokemonIds: [100, 25, 26], // Voltorb, Pikachu, Raichu
  },
  {
    id: 'erika',
    names: { en: 'Erika', de: 'Erika', fr: 'Erika', it: 'Erika', es: 'Erika' },
    group: 'gym',
    pokemonIds: [71, 114, 45], // Victreebel, Tangela, Vileplume
  },
  {
    id: 'koga',
    names: { en: 'Koga', de: 'Koga', fr: 'Koga', it: 'Koga', es: 'Koga' },
    group: 'gym',
    pokemonIds: [109, 89, 109, 110], // Koffing, Muk, Koffing, Weezing
  },
  {
    id: 'sabrina',
    names: { en: 'Sabrina', de: 'Sabrina', fr: 'Sabrina', it: 'Sabrina', es: 'Sabrina' },
    group: 'gym',
    pokemonIds: [64, 122, 49, 65], // Kadabra, Mr. Mime, Venomoth, Alakazam
  },
  {
    id: 'blaine',
    names: { en: 'Blaine', de: 'Pyrus', fr: 'Stanislas', it: 'Blaine', es: 'Blaine' },
    group: 'gym',
    pokemonIds: [58, 77, 78, 59], // Growlithe, Ponyta, Rapidash, Arcanine
  },
  {
    id: 'giovanni',
    names: { en: 'Giovanni', de: 'Giovanni', fr: 'Giovanni', it: 'Giovanni', es: 'Giovanni' },
    group: 'gym',
    pokemonIds: [111, 51, 31, 34, 112], // Rhyhorn, Dugtrio, Nidoqueen, Nidoking, Rhydon
  },

  // ── Elite Four ──────────────────────────────────────────────────
  {
    id: 'lorelei',
    names: { en: 'Lorelei', de: 'Lorelei', fr: 'Lorelei', it: 'Lorelei', es: 'Lorelei' },
    group: 'elite4',
    pokemonIds: [87, 91, 80, 124, 131], // Dewgong, Cloyster, Slowbro, Jynx, Lapras
  },
  {
    id: 'bruno',
    names: { en: 'Bruno', de: 'Bruno', fr: 'Bruno', it: 'Bruno', es: 'Bruno' },
    group: 'elite4',
    pokemonIds: [95, 107, 106, 95, 68], // Onix, Hitmonchan, Hitmonlee, Onix, Machamp
  },
  {
    id: 'agatha',
    names: { en: 'Agatha', de: 'Agathe', fr: 'Agatha', it: 'Agatha', es: 'Agatha' },
    group: 'elite4',
    pokemonIds: [94, 93, 94, 24, 94], // Gengar, Haunter, Gengar, Arbok, Gengar
  },
  {
    id: 'lance',
    names: { en: 'Lance', de: 'Siegfried', fr: 'Peter', it: 'Luca', es: 'Bruno' },
    group: 'elite4',
    pokemonIds: [130, 148, 148, 142, 149], // Gyarados, Dragonair, Dragonair, Aerodactyl, Dragonite
  },

  // ── Elite Four Rematch (post-National Dex) ──────────────────────
  {
    id: 'lorelei-rematch',
    names: { en: 'Lorelei', de: 'Lorelei', fr: 'Lorelei', it: 'Lorelei', es: 'Lorelei' },
    group: 'elite4-rematch',
    pokemonIds: [87, 91, 221, 124, 131], // Dewgong, Cloyster, Piloswine, Jynx, Lapras
  },
  {
    id: 'bruno-rematch',
    names: { en: 'Bruno', de: 'Bruno', fr: 'Bruno', it: 'Bruno', es: 'Bruno' },
    group: 'elite4-rematch',
    pokemonIds: [208, 107, 106, 208, 68], // Steelix, Hitmonchan, Hitmonlee, Steelix, Machamp
  },
  {
    id: 'agatha-rematch',
    names: { en: 'Agatha', de: 'Agathe', fr: 'Agatha', it: 'Agatha', es: 'Agatha' },
    group: 'elite4-rematch',
    pokemonIds: [94, 169, 200, 24, 94], // Gengar, Crobat, Misdreavus, Arbok, Gengar
  },
  {
    id: 'lance-rematch',
    names: { en: 'Lance', de: 'Siegfried', fr: 'Peter', it: 'Luca', es: 'Bruno' },
    group: 'elite4-rematch',
    pokemonIds: [130, 149, 230, 142, 149], // Gyarados, Dragonite, Kingdra, Aerodactyl, Dragonite
  },
]

export const GYM_LEADERS     = TRAINERS.filter(t => t.group === 'gym')
export const ELITE_FOUR      = TRAINERS.filter(t => t.group === 'elite4')
export const ELITE_FOUR_REMATCH = TRAINERS.filter(t => t.group === 'elite4-rematch')
