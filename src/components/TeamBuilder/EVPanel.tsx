import React from 'react'
import { useTeamStore } from '../../store/teamStore'
import { NATURES, NATURE_BY_ID } from '../../data/natures'
import type { EVs } from '../../types'
import type { Lang } from '../../types'
import { t } from '../../utils/i18n'

const MAX_TOTAL = 510
const MAX_SINGLE = 252

const EV_STATS: Array<{ key: keyof EVs; labelKey: 'statHp' | 'statAtk' | 'statDef' | 'statSpAtk' | 'statSpDef' | 'statSpe' }> = [
  { key: 'hp',    labelKey: 'statHp' },
  { key: 'atk',   labelKey: 'statAtk' },
  { key: 'def',   labelKey: 'statDef' },
  { key: 'spatk', labelKey: 'statSpAtk' },
  { key: 'spdef', labelKey: 'statSpDef' },
  { key: 'spe',   labelKey: 'statSpe' },
]

interface Props {
  slotIndex: number
  language: Lang
}

export const EVPanel: React.FC<Props> = ({ slotIndex, language }) => {
  const slot = useTeamStore(s => s.activeTeam.slots[slotIndex])
  const setNature = useTeamStore(s => s.setNature)
  const setEVs = useTeamStore(s => s.setEVs)

  const evs: EVs = slot.evs ?? { hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, spe: 0 }
  const totalEvs = Object.values(evs).reduce((s, v) => s + v, 0)
  const remaining = MAX_TOTAL - totalEvs

  const nature = slot.nature ? NATURE_BY_ID[slot.nature] : null

  const handleEV = (key: keyof EVs, raw: string) => {
    let val = parseInt(raw, 10)
    if (isNaN(val) || val < 0) val = 0
    if (val > MAX_SINGLE) val = MAX_SINGLE
    const newTotal = totalEvs - evs[key] + val
    if (newTotal > MAX_TOTAL) val = evs[key] + remaining
    setEVs(slotIndex, { ...evs, [key]: val })
  }

  const statColor = (key: keyof EVs) => {
    if (!nature) return 'var(--text-primary)'
    if (key === 'hp') return 'var(--text-primary)'
    if (nature.plus === key) return '#4ade80'
    if (nature.minus === key) return '#f97316'
    return 'var(--text-primary)'
  }

  const totalColor = totalEvs > MAX_TOTAL ? '#ef4444' : totalEvs === MAX_TOTAL ? '#4ade80' : 'var(--text-muted)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '8px', background: 'rgba(0,0,0,0.15)', borderRadius: 3, border: '1px solid var(--border)' }}>
      {/* Nature row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.08em', minWidth: 32 }}>
          {t('nature', language).toUpperCase()}
        </span>
        <select
          value={slot.nature ?? ''}
          onChange={e => setNature(slotIndex, e.target.value || undefined)}
          style={{
            flex: 1,
            padding: '3px 6px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 2,
            color: 'var(--text-primary)',
            fontSize: 12,
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <option value="">{t('noNature', language)}</option>
          {NATURES.map(n => {
            const name = n.names[language] || n.names.en
            const suffix = n.plus ? ` (+${n.plus === 'spatk' ? 'SpAtk' : n.plus === 'spdef' ? 'SpDef' : n.plus.charAt(0).toUpperCase() + n.plus.slice(1)} / -${n.minus === 'spatk' ? 'SpAtk' : n.minus === 'spdef' ? 'SpDef' : (n.minus?.charAt(0).toUpperCase() ?? '') + (n.minus?.slice(1) ?? '')})` : ''
            return (
              <option key={n.id} value={n.id}>{name}{suffix}</option>
            )
          })}
        </select>
        {nature && nature.plus && (
          <span style={{ fontSize: 10, fontFamily: "'Share Tech Mono', monospace", whiteSpace: 'nowrap' }}>
            <span style={{ color: '#4ade80' }}>+{nature.plus === 'spatk' ? 'SpA' : nature.plus === 'spdef' ? 'SpD' : nature.plus.charAt(0).toUpperCase() + nature.plus.slice(1)}</span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: '#f97316' }}>-{nature.minus === 'spatk' ? 'SpA' : nature.minus === 'spdef' ? 'SpD' : (nature.minus?.charAt(0).toUpperCase() ?? '') + (nature.minus?.slice(1) ?? '')}</span>
          </span>
        )}
      </div>

      {/* EV grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px 8px' }}>
        {EV_STATS.map(({ key, labelKey }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: statColor(key as any), fontFamily: "'Share Tech Mono', monospace", minWidth: 30, letterSpacing: '0.05em' }}>
              {t(labelKey, language)}
            </span>
            <input
              type="number"
              min={0}
              max={MAX_SINGLE}
              value={evs[key]}
              onChange={e => handleEV(key, e.target.value)}
              style={{
                width: '100%',
                padding: '2px 4px',
                background: 'var(--bg-card)',
                border: `1px solid ${evs[key] === MAX_SINGLE ? 'rgba(74,222,128,0.4)' : 'var(--border)'}`,
                borderRadius: 2,
                color: statColor(key as any),
                fontSize: 12,
                fontFamily: "'Share Tech Mono', monospace",
                textAlign: 'right',
              }}
            />
          </div>
        ))}
      </div>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Share Tech Mono', monospace" }}>
          {t('evTotal', language)}:
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: totalColor, fontFamily: "'Share Tech Mono', monospace" }}>
          {totalEvs} / {MAX_TOTAL}
        </span>
      </div>
    </div>
  )
}
