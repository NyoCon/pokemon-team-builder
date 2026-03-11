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
  const advancedMode = useTeamStore(s => s.advancedMode)
  const setAdvancedMode = useTeamStore(s => s.setAdvancedMode)
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

      {/* Advanced mode toggle */}
      <button
        onClick={() => setAdvancedMode(!advancedMode)}
        style={{
          padding: '4px 10px',
          background: advancedMode ? 'rgba(99,102,241,0.15)' : 'transparent',
          border: advancedMode ? '1px solid rgba(99,102,241,0.5)' : '1px solid var(--border)',
          borderRadius: 2,
          color: advancedMode ? '#818cf8' : 'var(--text-muted)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          fontFamily: "'Rajdhani', sans-serif",
          cursor: 'pointer',
          textTransform: 'uppercase',
        }}
      >
        {t('advancedMode', language)}
      </button>

      {/* GitHub link */}
      <a
        href="https://github.com/NyoCon/pokemon-team-builder"
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub"
        style={{ color: 'var(--text-muted)', fontSize: 18, lineHeight: 1, textDecoration: 'none' }}
      >
        <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
      </a>

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
