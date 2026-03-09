import React from 'react'
import { getTypeColor } from '../../utils/typeColors'
import { useTeamStore } from '../../store/teamStore'
import { useCacheStore } from '../../store/cacheStore'

interface Props {
  typeName: string // english slug
  small?: boolean
}

export const TypeBadge: React.FC<Props> = ({ typeName, small }) => {
  const language = useTeamStore(s => s.language)
  const typeNames = useCacheStore(s => s.typeNames)
  const color = getTypeColor(typeName)

  const label = typeNames[typeName]?.[language] || typeNames[typeName]?.['en'] || typeName

  return (
    <span
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        color: color.text,
        boxShadow: `0 0 6px ${color.glow}`,
        fontSize: small ? '11px' : '12px',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: small ? '1px 5px' : '2px 7px',
        borderRadius: '2px',
        display: 'inline-block',
        fontFamily: "'Rajdhani', sans-serif",
        lineHeight: '1.4',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}
