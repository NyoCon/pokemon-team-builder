import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useCacheStore } from '../../store/cacheStore'
import { useTeamStore } from '../../store/teamStore'
import { fetchItemDetail } from '../../api/queries'
import { FRLG_ITEM_SLUGS } from '../../data/items'
import { t } from '../../utils/i18n'

interface Props {
  value: string | undefined
  onChange: (slug: string | undefined) => void
}

export const ItemPicker: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const language = useTeamStore(s => s.language)
  const itemCache = useCacheStore(s => s.itemCache)
  const addItemsToCache = useCacheStore(s => s.addItemsToCache)

  // Fetch all FRLG items when picker first opens
  useEffect(() => {
    if (!open) return
    const missing = FRLG_ITEM_SLUGS.filter(slug => !itemCache[slug])
    if (!missing.length) return
    Promise.allSettled(missing.map(slug => fetchItemDetail(slug))).then(results => {
      const items = results.flatMap(r => r.status === 'fulfilled' ? [r.value] : [])
      if (items.length) addItemsToCache(items)
    })
  }, [open])

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

  const selected = value ? itemCache[value] : null
  const displayName = selected ? (selected.names[language] || selected.names.en) : null

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return FRLG_ITEM_SLUGS
      .map(slug => itemCache[slug])
      .filter(item => {
        if (!item) return false
        if (!q) return true
        const name = item.names[language] || item.names.en || ''
        return name.toLowerCase().includes(q)
      })
  }, [search, itemCache, language])

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
        {selected?.spriteUrl && (
          <img src={selected.spriteUrl} alt="" style={{ width: 20, height: 20, imageRendering: 'pixelated' }} />
        )}
        <span style={{ flex: 1 }}>{displayName ?? t('chooseItem', language)}</span>
        {value && (
          <span onClick={e => { e.stopPropagation(); onChange(undefined) }} style={{ color: 'var(--text-muted)', fontSize: 14 }}>×</span>
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
            maxHeight: 260,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
          }}
        >
          <div style={{ padding: '5px 6px', borderBottom: '1px solid var(--border)' }}>
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchItem', language)}
              style={{ width: '100%', padding: '4px 6px', fontSize: 11, borderRadius: 2, boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.map(item => {
              const name = item.names[language] || item.names.en
              return (
                <button
                  key={item.slug}
                  onClick={() => { onChange(item.slug); setOpen(false) }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 8px',
                    background: item.slug === value ? 'var(--bg-hover)' : 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = item.slug === value ? 'var(--bg-hover)' : 'transparent')}
                >
                  {item.spriteUrl
                    ? <img src={item.spriteUrl} alt="" style={{ width: 20, height: 20, imageRendering: 'pixelated' }} />
                    : <span style={{ width: 20 }} />
                  }
                  <span>{name}</span>
                </button>
              )
            })}
            {filtered.length === 0 && (
              <div style={{ padding: 12, color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
                {t('noItemsFound', language)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
