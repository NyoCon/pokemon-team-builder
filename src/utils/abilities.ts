/**
 * Ability-based type immunities for Gen 3 (FireRed / LeafGreen).
 * Only includes Pokémon where the immunity ability is guaranteed
 * (single-ability species in Gen 3).
 *
 * Map: pokemonId → move types the Pokémon is immune to via ability
 */
export const ABILITY_IMMUNITIES: Record<number, string[]> = {
  // Levitate → Ground immune
  92:  ['ground'], // Gastly
  93:  ['ground'], // Haunter
  94:  ['ground'], // Gengar
  109: ['ground'], // Koffing
  110: ['ground'], // Weezing
  200: ['ground'], // Misdreavus

  // Flash Fire → Fire immune
  37:  ['fire'], // Vulpix
  38:  ['fire'], // Ninetales
  136: ['fire'], // Flareon

  // Water Absorb → Water immune
  134: ['water'], // Vaporeon

  // Volt Absorb → Electric immune
  135: ['electric'], // Jolteon
}

export function getAbilityImmunities(pokemonId: number): string[] {
  return ABILITY_IMMUNITIES[pokemonId] ?? []
}
