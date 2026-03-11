import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useCacheStore } from '../../store/cacheStore'
import { useTeamStore } from '../../store/teamStore'
import { TypeBadge } from './TypeBadge'
import { t } from '../../utils/i18n'
import { TYPE_COLORS } from '../../utils/typeColors'

interface Props {
  value: number | null
  pokemonId?: number | null
  onChange: (id: number | null) => void
}

export const MovePicker: React.FC<Props> = ({ value, pokemonId, onChange }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [learnableOnly, setLearnableOnly] = useState(false)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const language = useTeamStore(s => s.language)
  const moveCache = useCacheStore(s => s.moveCache)
  const allMoveIds = useCacheStore(s => s.allMoveIds)
  const pokemonMovesets = useCacheStore(s => s.pokemonMovesets)

  const learnset = pokemonId ? (pokemonMovesets[pokemonId] ?? null) : null

  const selected = value ? moveCache[value] : null
  const displayName = selected ? (selected.names[language] || selected.names.en) : null

  const allCachedMoves = useMemo(() => {
    return allMoveIds.map(id => moveCache[id]).filter(Boolean)
  }, [allMoveIds, moveCache])

  // Types present in current move pool (for filter chips)
  const availableTypes = useMemo(() => {
    const types = new Set(allCachedMoves.map(m => m.type))
    return [...types].sort()
  }, [allCachedMoves])

  const filtered = useMemo(() => {
    let moves = allCachedMoves
    if (learnableOnly && learnset) {
      const set = new Set(learnset)
      moves = moves.filter(m => set.has(m.id))
    }
    if (filterType) {
      moves = moves.filter(m => m.type === filterType)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      moves = moves.filter(m => (m.names[language] || m.names.en || '').toLowerCase().includes(q))
    }
    return moves
  }, [allCachedMoves, learnableOnly, learnset, filterType, search, language])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleOpen() {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 2, left: rect.left, width: rect.width })
    }
    setOpen(true)
    setSearch('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange(null)
  }

  const isLoading = allMoveIds.length === 0

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <button
        onClick={handleOpen}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 8px',
          background: 'var(--bg-deep)',
          border: open ? '1px solid var(--accent)' : '1px solid var(--border)',
          borderRadius: 2,
          color: displayName ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: 13,
          fontWeight: 500,
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        {selected && <TypeBadge typeName={selected.type} small />}
        <span style={{ flex: 1 }}>{displayName ?? t('chooseMove', language)}</span>
        {selected && (
          <span onClick={handleClear} style={{ color: 'var(--text-muted)', fontSize: 14 }}>×</span>
        )}
      </button>

      {open && dropdownPos && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-bright)',
            borderRadius: 3,
            zIndex: 1000,
            maxHeight: 320,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
          }}
        >
          {/* Search row */}
          <div style={{ padding: '5px 6px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchMove', language)}
              style={{ flex: 1, padding: '4px 6px', fontSize: 11, borderRadius: 2 }}
            />
            {isLoading && (
              <span style={{ color: 'var(--text-muted)', fontSize: 10, whiteSpace: 'nowrap' }}>…</span>
            )}
            {learnset && (
              <button
                onClick={() => setLearnableOnly(v => !v)}
                title={learnableOnly ? 'Alle Attacken' : 'Nur lernbare Attacken'}
                style={{
                  padding: '3px 7px',
                  background: learnableOnly ? 'rgba(99,102,241,0.2)' : 'transparent',
                  border: `1px solid ${learnableOnly ? 'rgba(99,102,241,0.6)' : 'var(--border)'}`,
                  borderRadius: 2,
                  color: learnableOnly ? '#818cf8' : 'var(--text-muted)',
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {learnableOnly ? '★ Lernbar' : '☆ Lernbar'}
              </button>
            )}
          </div>

          {/* Type filter dropdown */}
          <div style={{ padding: '4px 6px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <select
              value={filterType ?? ''}
              onChange={e => setFilterType(e.target.value || null)}
              style={{
                width: '100%',
                padding: '3px 6px',
                background: 'var(--bg-deep)',
                border: `1px solid ${filterType ? (TYPE_COLORS[filterType]?.text ?? 'var(--border)') : 'var(--border)'}`,
                borderRadius: 2,
                color: filterType ? (TYPE_COLORS[filterType]?.text ?? 'var(--text-primary)') : 'var(--text-muted)',
                fontSize: 11,
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <option value="">— Alle Typen —</option>
              {availableTypes.map(type => (
                <option key={type} value={type} style={{ textTransform: 'capitalize' }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Move list */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.map(m => {
              const name = m.names[language] || m.names.en
              return (
                <button
                  key={m.id}
                  onClick={() => { onChange(m.id); setOpen(false) }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 8px',
                    background: m.id === value ? 'var(--bg-hover)' : 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = m.id === value ? 'var(--bg-hover)' : 'transparent')}
                >
                  <TypeBadge typeName={m.type} small />
                  <span style={{ flex: 1 }}>{name}</span>
                  {m.power && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{m.power}</span>}
                  <span style={{ color: 'var(--text-muted)', fontSize: 11, letterSpacing: '0.05em' }}>
                    {m.damageClass === 'physical' ? 'PHY' : m.damageClass === 'special' ? 'SPC' : 'STA'}
                  </span>
                </button>
              )
            })}
            {filtered.length === 0 && (
              <div style={{ padding: 12, color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
                {t('noMovesFound', language)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
