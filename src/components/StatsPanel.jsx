import { getSuggestions, } from '../hooks/useStats.js';
import { relativeDate } from '../utils.js';

const BG = 'rgba(255,255,255,0.04)';
const BORDER = '1px solid rgba(255,255,255,0.1)';

// Accuracy bar colour: red → amber → green
function accuracyColor(pct) {
  if (pct === null) return '#666';
  if (pct < 50) return '#e05050';
  if (pct < 75) return '#e8c050';
  return '#4cc864';
}

function AccuracyBar({ pct }) {
  const color = accuracyColor(pct);
  return (
    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', flex: 1 }}>
      <div style={{
        height: '100%', width: `${pct ?? 0}%`,
        background: color, borderRadius: 3,
        transition: 'width 0.4s ease',
      }} />
    </div>
  );
}

function SuggestionBadge({ reason, T }) {
  const map = {
    not_started:  { label: T.notStarted,  color: '#7ca8e8' },
    struggling:   { label: T.struggling,  color: '#e05050' },
    needs_work:   { label: T.needsWork,   color: '#e8c050' },
    not_recent:   { label: T.notRecent,   color: '#a87ce8' },
    good:         { label: T.good,        color: '#4cc864' },
  };
  const { label, color } = map[reason] || map.good;
  return (
    <span style={{
      fontSize: 11, padding: '2px 8px', borderRadius: 10,
      background: `${color}22`, border: `1px solid ${color}66`,
      color, fontFamily: 'sans-serif', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

export default function StatsPanel({ stats, topicKeys, topicData, getTopicSummary, resetStats, resetTopic, T, onStartTopic }) {
  const suggestions = getSuggestions(stats, topicKeys, 3);
  const hasAnyData = topicKeys.some(k => stats[k]?.seen > 0);

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 16px 40px' }}>

      {/* ── Suggestions ─────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#f0e6d3', fontSize: 20, marginBottom: 16 }}>
          {T.suggestionsTitle}
        </h2>

        {suggestions.map(({ key, reason }) => {
          const summary = getTopicSummary(key);
          const td = topicData[key];
          return (
            <div key={key} style={{
              background: BG, border: BORDER,
              borderLeft: `3px solid ${td?.color || '#888'}`,
              borderRadius: 10, padding: '14px 18px',
              marginBottom: 10, display: 'flex',
              alignItems: 'center', gap: 14, flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 22 }}>{td?.icon}</span>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontFamily: 'Georgia, serif', color: '#f0e6d3', fontSize: 15, marginBottom: 4 }}>
                  {key}
                </div>
                <SuggestionBadge reason={reason} T={T} />
              </div>
              {summary.seen > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
                  <AccuracyBar pct={summary.recentAccuracy} />
                  <span style={{ fontFamily: 'sans-serif', fontSize: 12, color: accuracyColor(summary.recentAccuracy), minWidth: 36 }}>
                    {summary.recentAccuracy}%
                  </span>
                </div>
              )}
              <button onClick={() => onStartTopic(key)} style={{
                background: `${td?.color || '#888'}22`,
                border: `1px solid ${td?.color || '#888'}66`,
                color: td?.color || '#f0e6d3',
                borderRadius: 8, padding: '6px 14px',
                cursor: 'pointer', fontFamily: 'sans-serif', fontSize: 13,
              }}>
                {T.studyNow} →
              </button>
            </div>
          );
        })}
      </section>

      {/* ── All Topics ──────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#f0e6d3', fontSize: 20, marginBottom: 16 }}>
          {T.allTopics}
        </h2>

        {topicKeys.map(key => {
          const summary = getTopicSummary(key);
          const td = topicData[key];
          return (
            <div key={key} style={{
              background: BG, border: BORDER,
              borderRadius: 10, padding: '12px 18px',
              marginBottom: 8, display: 'flex',
              alignItems: 'center', gap: 14, flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 20 }}>{td?.icon}</span>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontFamily: 'Georgia, serif', color: '#f0e6d3', fontSize: 14 }}>{key}</div>
                {summary.seen > 0 ? (
                  <div style={{ fontFamily: 'sans-serif', fontSize: 11, color: 'rgba(240,230,211,0.5)', marginTop: 2 }}>
                    {summary.seen} {T.answered} · {summary.correct} {T.correct} · {relativeDate(summary.lastSeen)}
                  </div>
                ) : (
                  <div style={{ fontFamily: 'sans-serif', fontSize: 11, color: 'rgba(240,230,211,0.35)', marginTop: 2 }}>
                    {T.notStartedYet}
                  </div>
                )}
              </div>

              {summary.seen > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 130 }}>
                    <AccuracyBar pct={summary.accuracy} />
                    <span style={{ fontFamily: 'sans-serif', fontSize: 12, color: accuracyColor(summary.accuracy), minWidth: 36 }}>
                      {summary.accuracy}%
                    </span>
                  </div>
                  <button
                    onClick={() => { if (window.confirm(`Reset stats for "${key}"?`)) resetTopic(key); }}
                    style={{
                      background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                      color: 'rgba(240,230,211,0.4)', borderRadius: 6,
                      padding: '4px 10px', cursor: 'pointer',
                      fontFamily: 'sans-serif', fontSize: 11,
                    }}
                  >
                    ↺
                  </button>
                </>
              )}
            </div>
          );
        })}
      </section>

      {/* ── Reset all ───────────────────────────────────────────────────── */}
      {hasAnyData && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button
            onClick={() => { if (window.confirm(T.confirmReset)) resetStats(); }}
            style={{
              background: 'transparent', border: '1px solid rgba(220,80,80,0.4)',
              color: 'rgba(220,80,80,0.7)', borderRadius: 8,
              padding: '8px 20px', cursor: 'pointer',
              fontFamily: 'sans-serif', fontSize: 13,
            }}
          >
            {T.resetAll}
          </button>
        </div>
      )}
    </div>
  );
}
