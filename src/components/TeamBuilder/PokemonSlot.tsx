import React, { useState } from 'react'
import { PokemonPicker } from './PokemonPicker'
import { MoveSlot } from './MoveSlot'
import { TypeBadge } from './TypeBadge'
import { EVPanel } from './EVPanel'
import { ItemPicker } from './ItemPicker'
import { useTeamStore } from '../../store/teamStore'
import { useCacheStore } from '../../store/cacheStore'
import { t } from '../../utils/i18n'

interface Props {
  slotIndex: number
}

export const PokemonSlot: React.FC<Props> = ({ slotIndex }) => {
  const setSlot = useTeamStore(s => s.setSlot)
  const setItem = useTeamStore(s => s.setItem)
  const addToRoster = useTeamStore(s => s.addToRoster)
  const slot = useTeamStore(s => s.activeTeam.slots[slotIndex])
  const language = useTeamStore(s => s.language)
  const advancedMode = useTeamStore(s => s.advancedMode)
  const pokemonList = useCacheStore(s => s.pokemonList)
  const [savedToBox, setSavedToBox] = useState(false)

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
          fontSize: 12,
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: '0.1em',
          fontWeight: 700,
        }}>
          SLOT {slotIndex + 1}
        </span>
        {pokemon && (
          <span style={{
            color: 'var(--text-muted)',
            fontSize: 12,
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
          {advancedMode && (
            <ItemPicker value={slot.item} onChange={slug => setItem(slotIndex, slug)} />
          )}
          {advancedMode && <EVPanel slotIndex={slotIndex} language={language} />}
          <button
            onClick={() => {
              addToRoster({ label: '', pokemonId: pokemon.id, moveIds: [...slot.moveIds], nature: slot.nature, evs: slot.evs, item: slot.item })
              setSavedToBox(true)
              setTimeout(() => setSavedToBox(false), 1500)
            }}
            style={{
              marginTop: 2,
              padding: '4px 0',
              background: savedToBox ? 'rgba(167,139,250,0.15)' : 'rgba(167,139,250,0.06)',
              border: savedToBox ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(167,139,250,0.2)',
              borderRadius: 2,
              color: '#a78bfa',
              fontSize: 10, fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            {savedToBox ? '✓ Box' : t('saveToRoster', language)}
          </button>
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
