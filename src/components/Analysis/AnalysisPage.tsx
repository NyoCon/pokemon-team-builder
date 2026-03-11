import React, { useMemo } from 'react'
import { PokemonPicker } from '../TeamBuilder/PokemonPicker'
import { TypeBadge } from '../TeamBuilder/TypeBadge'
import { useTeamStore } from '../../store/teamStore'
import { useCacheStore } from '../../store/cacheStore'
import { calcDefenderEffectiveness } from '../../utils/effectiveness'
import { isSTAB } from '../../utils/stab'
import { getAbilityImmunities } from '../../utils/abilities'
import { t, type TKey } from '../../utils/i18n'
import type { MoveFilter } from '../../store/teamStore'
import { TRAINERS, GYM_LEADERS, ELITE_FOUR, ELITE_FOUR_REMATCH, GIOVANNI_ENCOUNTERS, RIVAL_BATTLES, CHAMPION, CHAMPION_REMATCH } from '../../data/trainers'
import type { MoveDetail, Lang } from '../../types'

export const AnalysisPage: React.FC = () => {
  const defenders = useTeamStore(s => s.defenders)
  const removeDefender = useTeamStore(s => s.removeDefender)
  const setDefenderAt = useTeamStore(s => s.setDefenderAt)
  const setDefenders = useTeamStore(s => s.setDefenders)
  const activeTeam = useTeamStore(s => s.activeTeam)
  const language = useTeamStore(s => s.language)

  const pokemonList = useCacheStore(s => s.pokemonList)
  const typeChart = useCacheStore(s => s.typeChart)
  const moveCache = useCacheStore(s => s.moveCache)

  const filter = useTeamStore(s => s.analysisFilter)
  const setAnalysisFilter = useTeamStore(s => s.setAnalysisFilter)
  const toggleFilter = (key: keyof MoveFilter) => setAnalysisFilter({ ...filter, [key]: !filter[key] })

  // Per-column slot list: col C has flat indices C, C+3, C+6, ...
  const columns = useMemo(() =>
    [0, 1, 2].map(col => {
      const items: Array<{ flatIndex: number; defId: number | null }> = []
      let p = 0
      while (col + p * 3 < defenders.length) {
        items.push({ flatIndex: col + p * 3, defId: defenders[col + p * 3] ?? null })
        p++
      }
      if (items.length === 0 || items[items.length - 1].defId !== null) {
        items.push({ flatIndex: col + p * 3, defId: null })
      }
      return items
    })
  , [defenders])

  const getMatchups = (defId: number | null) => {
    const defender = defId ? pokemonList.find(p => p.id === defId) : null
    if (!defender || !Object.keys(typeChart).length) return null

    const defenderImmunities = getAbilityImmunities(defender.id)

    const teamMatchups = activeTeam.slots.map((slot, i) => {
      const pokemon = slot.pokemonId ? pokemonList.find(p => p.id === slot.pokemonId) : null
      if (!pokemon) return null

      const cached = slot.moveIds.filter(Boolean).map(mid => moveCache[mid!]).filter(Boolean)

      const damaging = cached
        .filter(m => m.power != null)
        .map(move => {
          const mult = calcDefenderEffectiveness(move.type, defender.types, typeChart, defenderImmunities)
          const stab = isSTAB(move.type, pokemon.types)
          return { move, mult, stab }
        })

      const nonDamaging = cached
        .filter(m => m.power == null)
        .map(move => ({ move, mult: -1, stab: false }))

      const superEffective = damaging
        .filter(m => m.mult > 1)
        .sort((a, b) => {
          const dmgA = (a.move.power ?? 0) * a.mult
          const dmgB = (b.move.power ?? 0) * b.mult
          return dmgB !== dmgA ? dmgB - dmgA : b.mult - a.mult
        })

      const neutral = damaging
        .filter(m => m.mult === 1)
        .sort((a, b) => (b.move.power ?? 0) - (a.move.power ?? 0))

      const resisted = damaging
        .filter(m => m.mult > 0 && m.mult < 1)
        .sort((a, b) => a.mult - b.mult)

      const immune = damaging
        .filter(m => m.mult === 0)

      return { pokemon, superEffective, neutral, resisted, immune, nonDamaging, slotIndex: i }
    }).filter(Boolean)

    return { defender, teamMatchups }
  }

  const renderMoveRow = (
    { move, mult, stab }: { move: MoveDetail; mult: number; stab: boolean },
    lang: Lang
  ) => {
    const moveName = move.names[lang] || move.names.en
    const isX4 = mult >= 4
    const isImmune = mult === 0
    const isNonDamaging = mult === -1
    const isGood = mult > 1
    const isNeutral = mult === 1

    const bg = isNonDamaging
      ? 'rgba(139,92,246,0.06)'
      : isGood
        ? isX4 ? 'rgba(74,222,128,0.08)' : 'rgba(74,222,128,0.04)'
        : isNeutral
          ? 'rgba(150,150,150,0.06)'
          : isImmune ? 'rgba(100,100,100,0.08)' : 'rgba(249,115,22,0.06)'

    const borderColor = isNonDamaging
      ? 'rgba(139,92,246,0.2)'
      : isGood
        ? isX4 ? 'rgba(74,222,128,0.3)' : 'rgba(74,222,128,0.12)'
        : isNeutral
          ? 'rgba(150,150,150,0.15)'
          : isImmune ? 'rgba(100,100,100,0.2)' : 'rgba(249,115,22,0.2)'

    const multColor = isNonDamaging
      ? '#a78bfa'
      : isGood ? '#4ade80'
      : isNeutral ? '#9ca3af'
      : isImmune ? '#6b7280' : '#f97316'

    const multLabel = isNonDamaging ? '—' : `${mult}×`

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
        <span style={{ color: multColor, fontSize: 13, fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>{multLabel}</span>
      </div>
    )
  }

  const FILTER_DEFS: Array<{ key: keyof MoveFilter; labelKey: TKey; activeColor: string; activeBg: string }> = [
    { key: 'superEffective', labelKey: 'filterSuperEff',    activeColor: '#4ade80', activeBg: 'rgba(74,222,128,0.12)' },
    { key: 'neutral',        labelKey: 'filterNeutral',     activeColor: '#d1d5db', activeBg: 'rgba(150,150,150,0.12)' },
    { key: 'resisted',       labelKey: 'filterResisted',    activeColor: '#f97316', activeBg: 'rgba(249,115,22,0.12)' },
    { key: 'immune',         labelKey: 'filterImmune',      activeColor: '#6b7280', activeBg: 'rgba(100,100,100,0.12)' },
    { key: 'nonDamaging',    labelKey: 'filterNonDamaging', activeColor: '#a78bfa', activeBg: 'rgba(139,92,246,0.12)' },
  ]

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
          onClick={() => setDefenders([null, null, null])}
          style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 3, color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', fontFamily: "'Rajdhani', sans-serif", cursor: 'pointer', textTransform: 'uppercase' }}
        >
          {t('clearAll', language)}
        </button>
      </div>

      {/* Filter toggles */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTER_DEFS.map(({ key, labelKey, activeColor, activeBg }) => {
          const active = filter[key]
          return (
            <button
              key={key}
              onClick={() => toggleFilter(key)}
              style={{
                padding: '4px 10px',
                border: `1px solid ${active ? activeColor : 'var(--border)'}`,
                borderRadius: 3,
                background: active ? activeBg : 'transparent',
                color: active ? activeColor : 'var(--text-muted)',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t(labelKey, language)}
            </button>
          )
        })}
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
          <optgroup label={t('championRematch', language)}>
            {CHAMPION_REMATCH.map(tr => (
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

      {/* 3 flex columns, each grows independently */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'start' }}>
        {columns.map((colItems, col) => (
          <div key={col} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {colItems.map(({ flatIndex, defId }) => {
              const result = getMatchups(defId)
              const defender = result?.defender ?? null
              const teamMatchups = result?.teamMatchups ?? []
              const canRemove = defenders.filter(d => d !== null).length > 0 && flatIndex < defenders.length && defenders.length > 3

              const visibleMatchups = teamMatchups.filter(m => {
                if (!m) return false
                return (
                  (filter.superEffective && m.superEffective.length > 0) ||
                  (filter.neutral && m.neutral.length > 0) ||
                  (filter.resisted && m.resisted.length > 0) ||
                  (filter.immune && m.immune.length > 0) ||
                  (filter.nonDamaging && m.nonDamaging.length > 0)
                )
              })

              return (
                <div key={flatIndex} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  {/* Picker header */}
                  <div style={{ padding: '8px 10px', background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: 9, fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.1em', fontWeight: 700 }}>
                        {t('opponent', language).toUpperCase()} {flatIndex + 1}
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
                          onClick={() => removeDefender(flatIndex)}
                          title={t('remove', language)}
                          style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 2, color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', padding: '0 5px', lineHeight: '18px' }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <PokemonPicker value={defId ?? null} onChange={id => setDefenderAt(flatIndex, id)} placeholderKey="chooseOpponent" />
                  </div>

                  {/* Matchup results */}
                  {!defender ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>—</div>
                  ) : visibleMatchups.length === 0 ? (
                    <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: 12 }}>
                      {teamMatchups.length === 0 ? t('noSuperEffective', language) : t('noMatchingMoves', language)}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {visibleMatchups.map((m, mi) => {
                        if (!m) return null
                        const { pokemon, superEffective, neutral, resisted, immune, nonDamaging, slotIndex } = m
                        const name = pokemon.names[language] || pokemon.names.en

                        const sections = [
                          ...(filter.superEffective ? superEffective : []),
                          ...(filter.neutral ? neutral : []),
                          ...(filter.resisted ? resisted : []),
                          ...(filter.immune ? immune : []),
                          ...(filter.nonDamaging ? nonDamaging : []),
                        ]

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
                              {sections.map(e => renderMoveRow(e, language))}
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
