import React from 'react'
import { PokemonSlot } from './PokemonSlot'
import { useTeamStore } from '../../store/teamStore'
import { t } from '../../utils/i18n'

export const TeamBuilder: React.FC = () => {
  const advancedMode = useTeamStore(s => s.advancedMode)
  const setAdvancedMode = useTeamStore(s => s.setAdvancedMode)
  const language = useTeamStore(s => s.language)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setAdvancedMode(!advancedMode)}
          style={{
            padding: '5px 12px',
            background: advancedMode ? 'rgba(99,102,241,0.15)' : 'transparent',
            border: advancedMode ? '1px solid rgba(99,102,241,0.5)' : '1px solid var(--border)',
            borderRadius: 3,
            color: advancedMode ? '#818cf8' : 'var(--text-muted)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            fontFamily: "'Rajdhani', sans-serif",
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          {t('advancedMode', language)}
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {([0, 1, 2, 3, 4, 5] as const).map(i => (
          <PokemonSlot key={i} slotIndex={i} />
        ))}
      </div>
    </div>
  )
}
