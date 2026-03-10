import React from 'react'
import { PokemonPicker } from '../TeamBuilder/PokemonPicker'
import { TypeBadge } from '../TeamBuilder/TypeBadge'
import { useTeamStore } from '../../store/teamStore'
import { useCacheStore } from '../../store/cacheStore'
import { calcDefenderEffectiveness } from '../../utils/effectiveness'
import { isSTAB } from '../../utils/stab'
import { t } from '../../utils/i18n'
import { TRAINERS, GYM_LEADERS, ELITE_FOUR, ELITE_FOUR_REMATCH, GIOVANNI_ENCOUNTERS, RIVAL_BATTLES, CHAMPION } from '../../data/trainers'
import type { MoveDetail, Lang } from '../../types'

export const AnalysisPage: React.FC = () => {
  const defenders = useTeamStore(s => s.defenders)
  const addDefender = useTeamStore(s => s.addDefender)
  const removeDefender = useTeamStore(s => s.removeDefender)
  const setDefenderAt = useTeamStore(s => s.setDefenderAt)
  const setDefenders = useTeamStore(s => s.setDefenders)
  const activeTeam = useTeamStore(s => s.activeTeam)
  const language = useTeamStore(s => s.language)

  const pokemonList = useCacheStore(s => s.pokemonList)
  const typeChart = useCacheStore(s => s.typeChart)
  const moveCache = useCacheStore(s => s.moveCache)

  const canRemove = defenders.length > 1

  const getMatchups = (defId: number | null) => {
    const defender = defId ? pokemonList.find(p => p.id === defId) : null
    if (!defender || !Object.keys(typeChart).length) return null

    const teamMatchups = activeTeam.slots.map((slot, i) => {
      const pokemon = slot.pokemonId ? pokemonList.find(p => p.id === slot.pokemonId) : null
      if (!pokemon) return null

      const allMoves = slot.moveIds
        .filter(Boolean)
        .map(mid => moveCache[mid!])
        .filter(m => m && m.power != null)
        .map(move => {
          const mult = calcDefenderEffectiveness(move.type, defender.types, typeChart)
          const stab = isSTAB(move.type, pokemon.types)
          return { move, mult, stab }
        })

      const superEffective = allMoves
        .filter(m => m.mult > 1)
        .sort((a, b) => {
          const dmgA = (a.move.power ?? 0) * a.mult
          const dmgB = (b.move.power ?? 0) * b.mult
          return dmgB !== dmgA ? dmgB - dmgA : b.mult - a.mult
        })

      const resisted = allMoves
        .filter(m => m.mult > 0 && m.mult < 1)
        .sort((a, b) => a.mult - b.mult)

      if (!superEffective.length && !resisted.length) return null
      return { pokemon, superEffective, resisted, slotIndex: i }
    }).filter(Boolean)

    return { defender, teamMatchups }
  }

  const renderMoveRow = (
    { move, mult, stab }: { move: MoveDetail; mult: number; stab: boolean },
    isGood: boolean,
    lang: Lang
  ) => {
    const moveName = move.names[lang] || move.names.en
    const isX4 = mult >= 4
    const isImmune = mult === 0
    const bg = isGood
      ? isX4 ? 'rgba(74,222,128,0.08)' : 'rgba(74,222,128,0.04)'
      : isImmune ? 'rgba(100,100,100,0.08)' : 'rgba(249,115,22,0.06)'
    const borderColor = isGood
      ? isX4 ? 'rgba(74,222,128,0.3)' : 'rgba(74,222,128,0.12)'
      : isImmune ? 'rgba(100,100,100,0.2)' : 'rgba(249,115,22,0.2)'
    const multColor = isGood ? '#4ade80' : isImmune ? '#6b7280' : '#f97316'

    return (
      <div key={move.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 6px', background: bg, border: `1px solid ${borderColor}`, borderRadius: 2 }}>
        <TypeBadge typeName={move.type} small />
        <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)' }}>{moveName}</span>
        {stab && (
          <span style={{ color: '#ffb347', fontSize: 10, fontWeight: 700, border: '1px solid rgba(255,179,71,0.4)', padding: '0 3px', borderRadius: 2 }}>STAB</span>
        )}
        {move.power != null && (
          <span style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>{move.power}</span>
        )}
        <span style={{ color: multColor, fontSize: 13, fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>{mult}×</span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 3, height: 20, background: 'var(--danger)', borderRadius: 2, boxShadow: '0 0 8px rgba(255,77,109,0.5)' }} />
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          {t('opponentAnalysis', language)}
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => defenders.forEach((_, i) => setDefenderAt(i, null))}
          style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 3, color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', fontFamily: "'Rajdhani', sans-serif", cursor: 'pointer', textTransform: 'uppercase' }}
        >
          {t('clearAll', language)}
        </button>
        <button
          onClick={addDefender}
          style={{ padding: '6px 14px', background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.3)', borderRadius: 3, color: 'var(--danger)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', fontFamily: "'Rajdhani', sans-serif", cursor: 'pointer', textTransform: 'uppercase' }}
        >
          {t('addOpponent', language)}
        </button>
      </div>

      {/* Trainer loader */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <select
          defaultValue=""
          onChange={e => {
            const trainer = TRAINERS.find(tr => tr.id === e.target.value)
            if (trainer) setDefenders(trainer.pokemonIds)
            e.target.value = ''
          }}
          style={{
            flex: 1,
            padding: '7px 10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 3,
            color: 'var(--text-primary)',
            fontSize: 12,
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <option value="" disabled>{t('loadTrainer', language)}</option>
          <optgroup label={t('gymLeaders', language)}>
            {GYM_LEADERS.map(tr => (
              <option key={tr.id} value={tr.id}>{tr.names[language] || tr.names.en}</option>
            ))}
          </optgroup>
          <optgroup label={t('eliteFour', language)}>
            {ELITE_FOUR.map(tr => (
              <option key={tr.id} value={tr.id}>{tr.names[language] || tr.names.en}</option>
            ))}
          </optgroup>
          <optgroup label={t('eliteFourRematch', language)}>
            {ELITE_FOUR_REMATCH.map(tr => (
              <option key={tr.id} value={tr.id}>{tr.names[language] || tr.names.en}</option>
            ))}
          </optgroup>
          <optgroup label={t('champion', language)}>
            {CHAMPION.map(tr => (
              <option key={tr.id} value={tr.id}>{tr.names[language] || tr.names.en}</option>
            ))}
          </optgroup>
          <optgroup label={t('giovanniGroup', language)}>
            {GIOVANNI_ENCOUNTERS.map(tr => (
              <option key={tr.id} value={tr.id}>{tr.names[language] || tr.names.en}</option>
            ))}
          </optgroup>
          <optgroup label={t('rivalBattles', language)}>
            {RIVAL_BATTLES.map(tr => (
              <option key={tr.id} value={tr.id}>{tr.names[language] || tr.names.en}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* 2 independent columns, cards stack vertically per column */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'start' }}>
        {[0, 1, 2].map(col => (
          <div key={col} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {defenders.map((defId, i) => {
              if (i % 3 !== col) return null
              const result = getMatchups(defId)
              const defender = result?.defender ?? null
              const teamMatchups = result?.teamMatchups ?? []
              return (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  {/* Picker header */}
                  <div style={{ padding: '8px 10px', background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: 9, fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.1em', fontWeight: 700 }}>
                        {t('opponent', language).toUpperCase()} {i + 1}
                      </span>
                      {defender && (
                        <span style={{ color: 'var(--text-muted)', fontSize: 9, fontFamily: "'Share Tech Mono', monospace" }}>
                          #{String(defender.id).padStart(3, '0')}
                        </span>
                      )}
                      <div style={{ flex: 1 }} />
                      {defender && defender.types.map(tp => <TypeBadge key={tp} typeName={tp} />)}
                      {canRemove && (
                        <button
                          onClick={() => removeDefender(i)}
                          title={t('remove', language)}
                          style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 2, color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', padding: '0 5px', lineHeight: '18px' }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <PokemonPicker value={defId ?? null} onChange={id => setDefenderAt(i, id)} placeholderKey="chooseOpponent" />
                  </div>

                  {/* Matchup results */}
                  {!defender ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>—</div>
                  ) : teamMatchups.length === 0 ? (
                    <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: 12 }}>{t('noSuperEffective', language)}</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {teamMatchups.map((m, mi) => {
                        if (!m) return null
                        const { pokemon, superEffective, resisted, slotIndex } = m
                        const name = pokemon.names[language] || pokemon.names.en
                        return (
                          <div key={slotIndex} style={{ borderTop: mi > 0 ? '1px solid var(--border)' : undefined, paddingTop: mi > 0 ? 6 : 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg-card2)' }}>
                              <img src={pokemon.spriteUrl} alt="" style={{ width: 24, height: 24, imageRendering: 'pixelated' }} />
                              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{name}</span>
                              <div style={{ display: 'flex', gap: 3 }}>
                                {pokemon.types.map(tp => <TypeBadge key={tp} typeName={tp} small />)}
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '6px 8px' }}>
                              {superEffective.map(e => renderMoveRow(e, true, language))}
                              {resisted.length > 0 && superEffective.length > 0 && (
                                <div style={{ borderTop: '1px solid var(--border)', margin: '2px 0' }} />
                              )}
                              {resisted.map(e => renderMoveRow(e, false, language))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
