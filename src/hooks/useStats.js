import { useState, useCallback } from 'react';

// ─── Storage key ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'altenpflege_stats_v1';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

// ─── Suggestion logic ─────────────────────────────────────────────────────────
// Returns topic keys sorted by priority (most needing work first).
// Priority score: combines low accuracy, high volume of wrong answers,
// and a small recency bonus for topics not studied recently.
export function getSuggestions(stats, topicKeys, count = 3) {
  const now = Date.now();
  const DAY = 86400000;

  const scored = topicKeys.map((key) => {
    const s = stats[key];
    if (!s || s.seen === 0) {
      // Never studied — high priority
      return { key, score: 1000, reason: 'not_started' };
    }

    const accuracy = s.correct / s.seen;                          // 0–1
    const recentAcc = s.recentCorrect / Math.max(s.recentSeen, 1); // last 10
    const daysSince = (now - (s.lastSeen || 0)) / DAY;
    const staleness = Math.min(daysSince / 7, 1);                  // caps at 1 week

    // Lower accuracy = higher score = higher priority
    const score = (1 - recentAcc) * 60 + (1 - accuracy) * 30 + staleness * 10;

    let reason = 'good';
    if (recentAcc < 0.5) reason = 'struggling';
    else if (recentAcc < 0.75) reason = 'needs_work';
    else if (staleness > 0.5) reason = 'not_recent';

    return { key, score, reason, accuracy: Math.round(accuracy * 100) };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useStats() {
  const [stats, setStats] = useState(loadStats);

  // Record one answer for a topic
  const recordAnswer = useCallback((topicKey, correct) => {
    setStats((prev) => {
      const existing = prev[topicKey] || {
        seen: 0,
        correct: 0,
        // Rolling window of last 10 answers
        recentSeen: 0,
        recentCorrect: 0,
        recentWindow: [],   // array of booleans, max 10
        lastSeen: null,
        firstSeen: null,
      };

      const window = [...(existing.recentWindow || []), correct];
      if (window.length > 10) window.shift();

      const updated = {
        ...existing,
        seen: existing.seen + 1,
        correct: existing.correct + (correct ? 1 : 0),
        recentWindow: window,
        recentSeen: window.length,
        recentCorrect: window.filter(Boolean).length,
        lastSeen: Date.now(),
        firstSeen: existing.firstSeen || Date.now(),
      };

      const next = { ...prev, [topicKey]: updated };
      saveStats(next);
      return next;
    });
  }, []);

  // Reset all stats (with confirmation in UI layer)
  const resetStats = useCallback(() => {
    setStats({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Reset stats for a single topic
  const resetTopic = useCallback((topicKey) => {
    setStats((prev) => {
      const next = { ...prev };
      delete next[topicKey];
      saveStats(next);
      return next;
    });
  }, []);

  // Get a quick summary for one topic
  const getTopicSummary = useCallback((topicKey) => {
    const s = stats[topicKey];
    if (!s || s.seen === 0) return { seen: 0, accuracy: null, recentAccuracy: null };
    return {
      seen: s.seen,
      correct: s.correct,
      accuracy: Math.round((s.correct / s.seen) * 100),
      recentAccuracy: Math.round((s.recentCorrect / s.recentSeen) * 100),
      lastSeen: s.lastSeen,
    };
  }, [stats]);

  return { stats, recordAnswer, resetStats, resetTopic, getTopicSummary };
}
