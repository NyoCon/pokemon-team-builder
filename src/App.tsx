import { useEffect, useState } from 'react'
import { t } from './utils/i18n'
import { Header } from './components/Layout/Header'
import { TeamBuilder } from './components/TeamBuilder/TeamBuilder'
import { AnalysisPage } from './components/Analysis/AnalysisPage'
import { TeamList } from './components/TeamManager/TeamList'
import { RosterPanel } from './components/Roster/RosterPanel'
import { useCacheStore } from './store/cacheStore'
import { useTeamStore } from './store/teamStore'
import { fetchAllPokemon, fetchAllTypes, fetchAllMoves, fetchAllItems, fetchAllPokemonMovesets } from './api/queries'
import { readTeamFromUrl } from './utils/urlEncoding'

function App() {
  const { setPokemonList, setTypeChart, setTypeNames, setAllMoveIds, addMovesToCache, addItemsToCache, setPokemonMovesets, setLoading, setError } = useCacheStore()
  const setActiveTeam = useTeamStore(s => s.setActiveTeam)
  const theme = useTeamStore(s => s.theme)
  const language = useTeamStore(s => s.language)
  const [activePage, setActivePage] = useState<'team' | 'analyse'>('team')
  const [sideTab, setSideTab] = useState<'teams' | 'box'>('teams')

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  useEffect(() => {
    // ?clear — wipe all localStorage cache, then strip param from URL (no reload)
    const params = new URLSearchParams(window.location.search)
    if (params.has('clear')) {
      localStorage.clear()
      params.delete('clear')
      const clean = window.location.pathname + (params.toString() ? '?' + params.toString() : '')
      history.replaceState(null, '', clean)
    }

    const teamFromUrl = readTeamFromUrl()
    if (teamFromUrl) setActiveTeam(teamFromUrl)

    setLoading(true)
    Promise.all([fetchAllPokemon(), fetchAllTypes(), fetchAllMoves(), fetchAllItems(), fetchAllPokemonMovesets()])
      .then(([pokemon, { chart, typeNames }, movesMap, itemsMap, pokemonMovesets]) => {
        setPokemonList(pokemon)
        setTypeChart(chart)
        setTypeNames(typeNames)
        addMovesToCache(Object.values(movesMap))
        setAllMoveIds(Object.keys(movesMap).map(Number))
        addItemsToCache(Object.values(itemsMap))
        setPokemonMovesets(pokemonMovesets)
        setLoading(false)
      })
      .catch(err => {
        setError(t('loadError', language))
        setLoading(false)
        console.error(err)
      })
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      {/* Page nav */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card2)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'center', gap: 0 }}>
          {(['team', 'analyse'] as const).map(page => {
            const labels = { team: t('pageTeam', language), analyse: t('pageAnalyse', language) }
            const active = activePage === page
            return (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                style={{
                  padding: '11px 28px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  fontFamily: "'Rajdhani', sans-serif",
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  marginBottom: -1,
                }}
              >
                {labels[page]}
              </button>
            )
          })}
        </div>
      </div>
      <main style={{
        flex: 1,
        padding: '20px 24px',
        maxWidth: 1400,
        margin: '0 auto',
        width: '100%',
        ...(activePage === 'team' ? {
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: 20,
          alignItems: 'start',
        } : {}),
      }}>
        {activePage === 'team' && (
          <>
            <TeamBuilder />
            <div style={{ position: 'sticky', top: 76 }}>
              {/* Tab bar */}
              <div style={{ display: 'flex', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderBottom: 'none', borderRadius: '4px 4px 0 0' }}>
                {(['teams', 'box'] as const).map((tab, i) => {
                  const labels = { teams: t('teams', language), box: t('roster', language) }
                  const active = sideTab === tab
                  return (
                    <button
                      key={tab}
                      onClick={() => setSideTab(tab)}
                      style={{
                        flex: 1,
                        padding: '9px 4px',
                        background: active ? 'var(--bg-card)' : 'transparent',
                        border: 'none',
                        borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                        borderRight: i < 1 ? '1px solid var(--border)' : 'none',
                        color: active ? 'var(--accent)' : 'var(--text-muted)',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        fontFamily: "'Rajdhani', sans-serif",
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                      }}
                    >
                      {labels[tab]}
                    </button>
                  )
                })}
              </div>
              {/* Tab content */}
              <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 4px 4px', overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
                {sideTab === 'teams' && <TeamList />}
                {sideTab === 'box' && <RosterPanel />}
              </div>
            </div>
          </>
        )}
        {activePage === 'analyse' && <AnalysisPage />}
      </main>
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 10, fontFamily: "'Share Tech Mono', monospace" }}>
          {t('dataSource', language)}
        </span>
        <a
          href="https://github.com/NyoCon/pokemon-team-builder"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          style={{ color: 'var(--text-muted)', lineHeight: 1, textDecoration: 'none' }}
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
      </footer>
    </div>
  )
}

export default App
