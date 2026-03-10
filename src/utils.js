export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function norm(s) {
  return (s || '')
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
}

// Build the flat question list with position metadata for language switching
export function buildAllQ(topics) {
  return Object.entries(topics).flatMap(([topic, data], tIdx) =>
    data.questions.map((q, qIdx) => ({
      ...q,
      topic,
      color: data.color,
      icon: data.icon,
      _tIdx: tIdx,
      _qIdx: qIdx,
    }))
  );
}

// Translate a single enriched question to another language's topics object
export function translateQ(q, newTopicsObj) {
  const newTopicKeys = Object.keys(newTopicsObj);
  const topicKey = newTopicKeys[q._tIdx];
  const topicData = newTopicsObj[topicKey];
  if (!topicData) return q;
  const raw = topicData.questions[q._qIdx];
  if (!raw) return q;
  return {
    ...raw,
    topic: topicKey,
    color: topicData.color,
    icon: topicData.icon,
    _tIdx: q._tIdx,
    _qIdx: q._qIdx,
  };
}

// Format a timestamp as a relative string ("2 days ago", "today", etc.)
export function relativeDate(ts) {
  if (!ts) return null;
  const days = Math.floor((Date.now() - ts) / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
}
