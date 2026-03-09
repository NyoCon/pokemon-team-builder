import React from 'react'
import { PokemonPicker } from './PokemonPicker'
import { MoveSlot } from './MoveSlot'
import { TypeBadge } from './TypeBadge'
import { useTeamStore } from '../../store/teamStore'
import { useCacheStore } from '../../store/cacheStore'
import { t } from '../../utils/i18n'

interface Props {
  slotIndex: number
}

export const PokemonSlot: React.FC<Props> = ({ slotIndex }) => {
  const setSlot = useTeamStore(s => s.setSlot)
  const slot = useTeamStore(s => s.activeTeam.slots[slotIndex])
  const language = useTeamStore(s => s.language)
  const pokemonList = useCacheStore(s => s.pokemonList)

  const pokemon = slot.pokemonId ? pokemonList.find(p => p.id === slot.pokemonId) : null

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      padding: '10px',
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
          SLOT {slotIndex + 1}
        </span>
        {pokemon && (
          <span style={{
            color: 'var(--text-muted)',
            fontSize: 9,
            fontFamily: "'Share Tech Mono', monospace",
          }}>
            #{String(pokemon.id).padStart(3, '0')}
          </span>
        )}
        <div style={{ flex: 1 }} />
        {pokemon && pokemon.types.map(t => <TypeBadge key={t} typeName={t} />)}
      </div>

      <PokemonPicker
        value={slot.pokemonId}
        onChange={id => setSlot(slotIndex, id)}
      />

      {pokemon && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {([0, 1, 2, 3] as const).map(mi => (
            <MoveSlot
              key={mi}
              slotIndex={slotIndex}
              moveIndex={mi}
              pokemonTypes={pokemon.types}
              moveId={slot.moveIds[mi]}
            />
          ))}
        </div>
      )}

      {!pokemon && (
        <div style={{
          padding: '20px 0',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: 11,
          letterSpacing: '0.05em',
        }}>
          {t('empty', language)}
        </div>
      )}
    </div>
  )
}
