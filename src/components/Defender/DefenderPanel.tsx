import React from 'react'
import { PokemonPicker } from '../TeamBuilder/PokemonPicker'
import { TypeBadge } from '../TeamBuilder/TypeBadge'
import { useTeamStore } from '../../store/teamStore'
import { useCacheStore } from '../../store/cacheStore'
import { calcDefenderEffectiveness } from '../../utils/effectiveness'
import { isSTAB } from '../../utils/stab'
import { t } from '../../utils/i18n'

export const DefenderPanel: React.FC = () => {
  const setDefender = useTeamStore(s => s.setDefender)
  const defenderPokemonId = useTeamStore(s => s.defenderPokemonId)
  const language = useTeamStore(s => s.language)
  const activeTeam = useTeamStore(s => s.activeTeam)

  const pokemonList = useCacheStore(s => s.pokemonList)
  const typeChart = useCacheStore(s => s.typeChart)
  const moveCache = useCacheStore(s => s.moveCache)

  const defender = defenderPokemonId ? pokemonList.find(p => p.id === defenderPokemonId) : null

  // For each team slot, find moves that are super effective against defender
  const teamMatchups = defender
    ? activeTeam.slots.map((slot, i) => {
        const pokemon = slot.pokemonId ? pokemonList.find(p => p.id === slot.pokemonId) : null
        if (!pokemon) return null

        const effectiveMoves = slot.moveIds
          .filter(Boolean)
          .map(mid => moveCache[mid!])
          .filter(Boolean)
          .map(move => {
            const mult = calcDefenderEffectiveness(move.type, defender.types, typeChart)
            const stab = isSTAB(move.type, pokemon.types)
            return { move, mult, stab }
          })
          .filter(m => m.mult > 1)
          .sort((a, b) => {
            const dmgA = (a.move.power ?? 0) * a.mult
            const dmgB = (b.move.power ?? 0) * b.mult
            if (dmgB !== dmgA) return dmgB - dmgA
            return b.mult - a.mult
          })

        return { pokemon, moves: effectiveMoves, slotIndex: i }
      }).filter(Boolean)
    : []

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      padding: 16,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 3,
          height: 20,
          background: 'var(--danger)',
          borderRadius: 2,
          boxShadow: '0 0 8px rgba(255,77,109,0.5)',
        }} />
        <span style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
        }}>
          {t('opponentAnalysis', language)}
        </span>
        <div style={{ flex: 1 }} />
        {defender && defender.types.map(t => <TypeBadge key={t} typeName={t} />)}
      </div>

      {/* Defender picker */}
      <div style={{ marginBottom: defender ? 16 : 0 }}>
        <PokemonPicker
          value={defenderPokemonId}
          onChange={setDefender}
          placeholderKey="chooseOpponent"
        />
      </div>

      {/* Matchup results */}
      {defender && Object.keys(typeChart).length > 0 && (
        <div>
          {teamMatchups.length === 0 ? (
            <div style={{
              padding: '16px 0',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 12,
            }}>
              {t('noSuperEffective', language)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {teamMatchups.map(m => {
                if (!m) return null
                const { pokemon, moves, slotIndex } = m
                const name = pokemon.names[language] || pokemon.names.en
                return (
                  <div
                    key={slotIndex}
                    style={{
                      background: 'var(--bg-card2)',
                      border: '1px solid var(--border)',
                      borderRadius: 3,
                      padding: '8px 10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <img src={pokemon.spriteUrl} alt="" style={{ width: 28, height: 28, imageRendering: 'pixelated' }} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{name}</span>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {pokemon.types.map(t => <TypeBadge key={t} typeName={t} small />)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {moves.map(({ move, mult, stab }) => {
                        const moveName = move.names[language] || move.names.en
                        const isX4 = mult >= 4
                        return (
                          <div
                            key={move.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '3px 6px',
                              background: isX4
                                ? 'rgba(74,222,128,0.08)'
                                : 'rgba(74,222,128,0.04)',
                              border: isX4
                                ? '1px solid rgba(74,222,128,0.3)'
                                : '1px solid rgba(74,222,128,0.12)',
                              borderRadius: 2,
                            }}
                          >
                            <TypeBadge typeName={move.type} small />
                            <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)' }}>{moveName}</span>
                            {stab && (
                              <span style={{
                                color: '#ffb347',
                                fontSize: 10,
                                fontWeight: 700,
                                border: '1px solid rgba(255,179,71,0.4)',
                                padding: '0 3px',
                                borderRadius: 2,
                              }}>STAB</span>
                            )}
                            {move.power != null && (
                              <span style={{
                                color: 'var(--text-muted)',
                                fontSize: 12,
                                fontFamily: "'Share Tech Mono', monospace",
                              }}>
                                {move.power}
                              </span>
                            )}
                            <span style={{
                              color: '#4ade80',
                              fontSize: 13,
                              fontWeight: 700,
                              fontFamily: "'Share Tech Mono', monospace",
                            }}>
                              {mult}×
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
