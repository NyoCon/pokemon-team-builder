import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useCacheStore } from '../../store/cacheStore'
import { useTeamStore } from '../../store/teamStore'
import { t } from '../../utils/i18n'
import type { PokemonSummary } from '../../types'

interface Props {
  value: number | null
  onChange: (id: number | null) => void
  placeholderKey?: 'choosePokemon' | 'chooseOpponent'
}

export const PokemonPicker: React.FC<Props> = ({ value, onChange, placeholderKey = 'choosePokemon' }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null)
  const pokemonList = useCacheStore(s => s.pokemonList)
  const language = useTeamStore(s => s.language)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = pokemonList.find(p => p.id === value)

  const filtered = useMemo(() => {
    if (!search.trim()) return pokemonList
    const q = search.toLowerCase()
    return pokemonList.filter(p => {
      const name = p.names[language] || p.names.en || ''
      return name.toLowerCase().includes(q) || String(p.id).includes(q)
    })
  }, [search, pokemonList, language])

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
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
    }
    setOpen(true)
    setSearch('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function handleSelect(p: PokemonSummary) {
    onChange(p.id)
    setOpen(false)
    setSearch('')
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange(null)
    setOpen(false)
  }

  const displayName = selected ? (selected.names[language] || selected.names.en) : null

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <button
        onClick={handleOpen}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px',
          background: 'var(--bg-deep)',
          border: open ? '1px solid var(--accent)' : '1px solid var(--border)',
          borderRadius: 3,
          color: displayName ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: 13,
          fontWeight: 600,
          textAlign: 'left',
          boxShadow: open ? '0 0 0 2px var(--accent-glow)' : 'none',
          cursor: 'pointer',
        }}
      >
        {selected?.spriteUrl && (
          <img src={selected.spriteUrl} alt="" style={{ width: 28, height: 28, imageRendering: 'pixelated', flexShrink: 0 }} />
        )}
        <span style={{ flex: 1 }}>
          {displayName ?? t(placeholderKey, language)}
        </span>
        {selected && (
          <span
            onClick={handleClear}
            style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1, padding: '0 2px' }}
          >×</span>
        )}
        <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{open ? '▲' : '▼'}</span>
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
            maxHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--border)' }}>
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('search', language)}
              style={{
                width: '100%',
                padding: '5px 8px',
                background: 'var(--bg-deep)',
                border: '1px solid var(--border)',
                borderRadius: 2,
                color: 'var(--text-primary)',
                fontSize: 12,
              }}
            />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.slice(0, 100).map(p => {
              const name = p.names[language] || p.names.en
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '4px 10px',
                    background: p.id === value ? 'var(--bg-hover)' : 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: 12,
                    fontWeight: 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = p.id === value ? 'var(--bg-hover)' : 'transparent')}
                >
                  <img src={p.spriteUrl} alt="" style={{ width: 24, height: 24, imageRendering: 'pixelated' }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: 10, minWidth: 24 }}>#{String(p.id).padStart(3, '0')}</span>
                  <span>{name}</span>
                </button>
              )
            })}
            {filtered.length === 0 && (
              <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>
                {t('noPokemonFound', language)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
