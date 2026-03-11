import React, { useState } from 'react'
import { MovePicker } from './MovePicker'
import { EffectivenessChart } from './EffectivenessChart'
import { useCacheStore } from '../../store/cacheStore'
import { useTeamStore } from '../../store/teamStore'
import { isSTAB } from '../../utils/stab'

interface Props {
  slotIndex: number
  moveIndex: number
  pokemonId: number | null
  pokemonTypes: string[]
  moveId: number | null
}

export const MoveSlot: React.FC<Props> = ({ slotIndex, moveIndex, pokemonId, pokemonTypes, moveId }) => {
  const setMove = useTeamStore(s => s.setMove)
  const moveCache = useCacheStore(s => s.moveCache)
  const move = moveId ? moveCache[moveId] : null
  const [expanded, setExpanded] = useState(false)

  const hasStab = move ? isSTAB(move.type, pokemonTypes) : false

  return (
    <div style={{
      background: 'var(--bg-deep)',
      border: '1px solid var(--border)',
      borderRadius: 3,
      padding: '6px 8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          color: 'var(--text-muted)',
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "'Share Tech Mono', monospace",
          minWidth: 14,
        }}>
          {moveIndex + 1}
        </span>
        <div style={{ flex: 1 }}>
          <MovePicker
            value={moveId}
            pokemonId={pokemonId}
            onChange={id => setMove(slotIndex, moveIndex, id)}
          />
        </div>
        {move && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            {hasStab && (
              <span style={{
                background: 'rgba(255,179,71,0.15)',
                border: '1px solid rgba(255,179,71,0.4)',
                color: '#ffb347',
                fontSize: 9,
                fontWeight: 700,
                padding: '1px 4px',
                borderRadius: 2,
                letterSpacing: '0.08em',
              }}>
                STAB
              </span>
            )}
            {move.power && (
              <span style={{
                color: 'var(--text-muted)',
                fontSize: 11,
                fontFamily: "'Share Tech Mono', monospace",
              }}>
                {move.power}
              </span>
            )}
            <button
              onClick={() => setExpanded(e => !e)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: 10,
                padding: '0 2px',
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              {expanded ? '▾' : '▸'}
            </button>
          </div>
        )}
      </div>
      {move && expanded && <EffectivenessChart moveType={move.type} />}
    </div>
  )
}
