import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useCacheStore } from '../../store/cacheStore'
import { useTeamStore } from '../../store/teamStore'
import { TypeBadge } from './TypeBadge'
import { fetchMoveDetail } from '../../api/queries'
import { t } from '../../utils/i18n'

interface Props {
  value: number | null
  onChange: (id: number | null) => void
}

export const MovePicker: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const language = useTeamStore(s => s.language)
  const moveCache = useCacheStore(s => s.moveCache)
  const allMoveIds = useCacheStore(s => s.allMoveIds)
  const addMovesToCache = useCacheStore(s => s.addMovesToCache)

  // When picker opens, fetch any moves not yet in cache
  useEffect(() => {
    if (!open || !allMoveIds.length) return
    const missing = allMoveIds.filter(id => !moveCache[id])
    if (!missing.length) return
    // Fetch in parallel batches of 50 to avoid flooding
    const BATCH = 50
    for (let i = 0; i < missing.length; i += BATCH) {
      const batch = missing.slice(i, i + BATCH)
      Promise.all(batch.map(id => fetchMoveDetail(id))).then(moves => {
        addMovesToCache(moves)
      })
    }
  }, [open, allMoveIds.length])

  const selected = value ? moveCache[value] : null
  const displayName = selected ? (selected.names[language] || selected.names.en) : null

  const cachedMoves = useMemo(() => {
    return allMoveIds.map(id => moveCache[id]).filter(Boolean)
  }, [allMoveIds, moveCache])

  const filtered = useMemo(() => {
    if (!search.trim()) return cachedMoves
    const q = search.toLowerCase()
    return cachedMoves.filter(m => {
      const name = m.names[language] || m.names.en || ''
      return name.toLowerCase().includes(q)
    })
  }, [search, cachedMoves, language])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleOpen() {
    setOpen(true)
    setSearch('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange(null)
  }

  const isLoading = allMoveIds.length > 0 && cachedMoves.length < allMoveIds.length

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

      {open && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 2px)',
            left: 0,
            right: 0,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-bright)',
            borderRadius: 3,
            zIndex: 200,
            maxHeight: 260,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
          }}
        >
          <div style={{ padding: '5px 6px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchMove', language)}
              style={{ flex: 1, padding: '4px 6px', fontSize: 11, borderRadius: 2 }}
            />
            {isLoading && (
              <span style={{ color: 'var(--text-muted)', fontSize: 10, whiteSpace: 'nowrap' }}>
                {cachedMoves.length}/{allMoveIds.length}
              </span>
            )}
          </div>
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
