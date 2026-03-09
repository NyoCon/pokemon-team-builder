import React, { useState } from 'react'
import { useTeamStore } from '../../store/teamStore'
import { getShareUrl } from '../../utils/urlEncoding'
import { t } from '../../utils/i18n'

export const TeamList: React.FC = () => {
  const { teams, saveTeam, loadTeam, deleteTeam, activeTeam, resetActiveTeam, language } = useTeamStore()
  const [saveName, setSaveName] = useState('')
  const [copied, setCopied] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const teamNames = Object.keys(teams)

  function handleSave() {
    const name = saveName.trim()
    if (!name) return
    saveTeam(name)
    setSaveName('')
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 1500)
  }

  function handleShare() {
    const url = getShareUrl(activeTeam)
    history.pushState(null, '', url)
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      padding: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 3,
          height: 20,
          background: 'var(--accent)',
          borderRadius: 2,
          boxShadow: '0 0 8px var(--accent-glow)',
        }} />
        <span style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
        }}>
          {t('teams', language)}
        </span>
      </div>

      {/* Share + Reset */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <button
          onClick={handleShare}
          style={{
            flex: 1,
            padding: '6px 10px',
            background: copied ? 'rgba(57,217,138,0.15)' : 'rgba(0,191,255,0.08)',
            border: copied ? '1px solid rgba(57,217,138,0.4)' : '1px solid rgba(0,191,255,0.3)',
            borderRadius: 3,
            color: copied ? '#39d98a' : 'var(--accent)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          {copied ? t('linkCopied', language) : t('shareTeam', language)}
        </button>
        <button
          onClick={resetActiveTeam}
          style={{
            padding: '6px 10px',
            background: 'rgba(255,77,109,0.06)',
            border: '1px solid rgba(255,77,109,0.2)',
            borderRadius: 3,
            color: 'var(--danger)',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {t('clearTeam', language)}
        </button>
      </div>

      {/* Save input */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        <input
          value={saveName}
          onChange={e => setSaveName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder={t('teamNamePlaceholder', language)}
          style={{ flex: 1, padding: '6px 8px', borderRadius: 3, fontSize: 12 }}
        />
        <button
          onClick={handleSave}
          disabled={!saveName.trim()}
          style={{
            padding: '6px 12px',
            background: saveSuccess ? 'rgba(57,217,138,0.15)' : 'rgba(0,191,255,0.1)',
            border: saveSuccess ? '1px solid rgba(57,217,138,0.4)' : '1px solid rgba(0,191,255,0.3)',
            borderRadius: 3,
            color: saveSuccess ? '#39d98a' : 'var(--accent)',
            fontSize: 11,
            fontWeight: 700,
            opacity: !saveName.trim() ? 0.4 : 1,
            cursor: !saveName.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {saveSuccess ? t('saved', language) : t('save', language)}
        </button>
      </div>

      {/* Team list */}
      {teamNames.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '8px 0' }}>
          {t('noSavedTeams', language)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {teamNames.map(name => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 8px',
                background: 'var(--bg-card2)',
                border: '1px solid var(--border)',
                borderRadius: 3,
              }}
            >
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                {name}
              </span>
              <button
                onClick={() => loadTeam(name)}
                style={{
                  padding: '3px 8px',
                  background: 'rgba(0,191,255,0.08)',
                  border: '1px solid rgba(0,191,255,0.2)',
                  borderRadius: 2,
                  color: 'var(--accent)',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                {t('load', language)}
              </button>
              <button
                onClick={() => deleteTeam(name)}
                style={{
                  padding: '3px 8px',
                  background: 'rgba(255,77,109,0.06)',
                  border: '1px solid rgba(255,77,109,0.15)',
                  borderRadius: 2,
                  color: 'var(--danger)',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
