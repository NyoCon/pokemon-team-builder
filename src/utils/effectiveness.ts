import type { TypeChart, EffectivenessMultiplier } from '../types'

export function calcEffectiveness(
  moveType: string,
  _defenderTypes: string[],
  typeChart: TypeChart
): Record<string, EffectivenessMultiplier> {
  const result: Record<string, EffectivenessMultiplier> = {}

  for (const targetType of Object.keys(typeChart)) {
    let multiplier: number = 1
    const chart = typeChart[moveType]
    if (!chart) { result[targetType] = 1; continue }

    if (chart.noDamageTo.includes(targetType)) multiplier = 0
    else if (chart.doubleDamageTo.includes(targetType)) multiplier *= 2
    else if (chart.halfDamageTo.includes(targetType)) multiplier *= 0.5

    result[targetType] = multiplier as EffectivenessMultiplier
  }

  return result
}

// For a specific defender with types (dual-type handled)
export function calcDefenderEffectiveness(
  moveType: string,
  defenderTypes: string[],
  typeChart: TypeChart
): EffectivenessMultiplier {
  const chart = typeChart[moveType]
  if (!chart) return 1

  let multiplier = 1
  for (const dt of defenderTypes) {
    if (chart.noDamageTo.includes(dt)) multiplier *= 0
    else if (chart.doubleDamageTo.includes(dt)) multiplier *= 2
    else if (chart.halfDamageTo.includes(dt)) multiplier *= 0.5
  }
  return multiplier as EffectivenessMultiplier
}

// Group type effectiveness by multiplier bucket (non-neutral only)
export function groupEffectivenessByType(
  moveType: string,
  typeChart: TypeChart
): { superEffective: string[]; notVeryEffective: string[]; immune: string[] } {
  const chart = typeChart[moveType]
  if (!chart) return { superEffective: [], notVeryEffective: [], immune: [] }

  return {
    superEffective: chart.doubleDamageTo,
    notVeryEffective: chart.halfDamageTo,
    immune: chart.noDamageTo,
  }
}
