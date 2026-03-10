import React from 'react'
import { PokemonPicker } from '../TeamBuilder/PokemonPicker'
import { TypeBadge } from '../TeamBuilder/TypeBadge'
import { useTeamStore } from '../../store/teamStore'
import { useCacheStore } from '../../store/cacheStore'

interface Props {
  index: number
  canRemove: boolean
}

export const DefenderCard: React.FC<Props> = ({ index, canRemove }) => {
  const defenders = useTeamStore(s => s.defenders)
  const setDefenderAt = useTeamStore(s => s.setDefenderAt)
  const removeDefender = useTeamStore(s => s.removeDefender)
  const pokemonList = useCacheStore(s => s.pokemonList)

  const pokemonId = defenders[index] ?? null
  const pokemon = pokemonId ? pokemonList.find(p => p.id === pokemonId) : null

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{
          color: 'var(--text-muted)',
          fontSize: 9,
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: '0.1em',
          fontWeight: 700,
        }}>
          GEGNER {index + 1}
        </span>
        {pokemon && (
          <span style={{ color: 'var(--text-muted)', fontSize: 9, fontFamily: "'Share Tech Mono', monospace" }}>
            #{String(pokemon.id).padStart(3, '0')}
          </span>
        )}
        <div style={{ flex: 1 }} />
        {pokemon && pokemon.types.map(tp => <TypeBadge key={tp} typeName={tp} />)}
        {canRemove && (
          <button
            onClick={() => removeDefender(index)}
            title="Entfernen"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 2,
              color: 'var(--text-muted)',
              fontSize: 11,
              cursor: 'pointer',
              padding: '0 5px',
              lineHeight: '18px',
            }}
          >
            ×
          </button>
        )}
      </div>

      <PokemonPicker
        value={pokemonId}
        onChange={id => setDefenderAt(index, id)}
        placeholderKey="chooseOpponent"
      />

      {!pokemon && (
        <div style={{
          padding: '16px 0',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: 11,
          letterSpacing: '0.05em',
        }}>
          —
        </div>
      )}
    </div>
  )
}
