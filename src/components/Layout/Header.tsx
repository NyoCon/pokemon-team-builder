import React from 'react'
import { useTeamStore } from '../../store/teamStore'
import { useCacheStore } from '../../store/cacheStore'
import { t } from '../../utils/i18n'
import type { Lang } from '../../types'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
  { code: 'it', label: 'IT' },
  { code: 'es', label: 'ES' },
]

export const Header: React.FC = () => {
  const language = useTeamStore(s => s.language)
  const setLanguage = useTeamStore(s => s.setLanguage)
  const theme = useTeamStore(s => s.theme)
  const setTheme = useTeamStore(s => s.setTheme)
  const loading = useCacheStore(s => s.loading)
  const error = useCacheStore(s => s.error)
  const pokemonList = useCacheStore(s => s.pokemonList)

  return (
    <header style={{
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      height: 56,
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Logo / Title */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          background: 'linear-gradient(135deg, #00bfff, #7038f8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          POKÉTEAM
        </span>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 10,
          color: 'var(--text-muted)',
          letterSpacing: '0.12em',
        }}>
          FR/LG
        </span>
      </div>

      {/* Status */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        {loading && (
          <span style={{ color: 'var(--accent)', fontSize: 13, letterSpacing: '0.05em' }}>
            <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
            {' '}{t('loadingData', language)}
          </span>
        )}
        {error && (
          <span style={{ color: 'var(--danger)', fontSize: 13 }}>⚠ {t('loadError', language)}</span>
        )}
        {!loading && !error && pokemonList.length > 0 && (
          <span style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>
            {t('pokemonLoaded', language, { n: pokemonList.length })}
          </span>
        )}
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        style={{
          padding: '4px 8px',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: 2,
          color: 'var(--text-muted)',
          fontSize: 14,
          lineHeight: 1,
        }}
      >
        {theme === 'dark' ? '☀' : '☾'}
      </button>

      {/* Language toggle */}
      <div style={{ display: 'flex', gap: 3 }}>
        {LANGS.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            style={{
              padding: '3px 8px',
              background: language === code ? 'rgba(0,191,255,0.15)' : 'transparent',
              border: language === code ? '1px solid rgba(0,191,255,0.4)' : '1px solid var(--border)',
              borderRadius: 2,
              color: language === code ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  )
}
