import React from 'react'
import { TypeBadge } from './TypeBadge'
import { groupEffectivenessByType } from '../../utils/effectiveness'
import { useCacheStore } from '../../store/cacheStore'

interface Props {
  moveType: string
}

export const EffectivenessChart: React.FC<Props> = ({ moveType }) => {
  const typeChart = useCacheStore(s => s.typeChart)
  const { superEffective, notVeryEffective, immune } = groupEffectivenessByType(moveType, typeChart)

  if (!Object.keys(typeChart).length) return null
  if (!superEffective.length && !notVeryEffective.length && !immune.length) return null

  return (
    <div style={{ marginTop: 6 }}>
      {superEffective.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3 }}>
          <span style={{ color: '#4ade80', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', minWidth: 28, marginTop: 2 }}>2×</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {superEffective.map(t => <TypeBadge key={t} typeName={t} small />)}
          </div>
        </div>
      )}
      {notVeryEffective.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3 }}>
          <span style={{ color: '#f97316', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', minWidth: 28, marginTop: 2 }}>½×</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {notVeryEffective.map(t => <TypeBadge key={t} typeName={t} small />)}
          </div>
        </div>
      )}
      {immune.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <span style={{ color: '#6b7280', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', minWidth: 28, marginTop: 2 }}>0×</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {immune.map(t => <TypeBadge key={t} typeName={t} small />)}
          </div>
        </div>
      )}
    </div>
  )
}
