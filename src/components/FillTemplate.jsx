import { useRef } from 'react';
import { norm } from '../utils.js';

export default function FillTemplate({ template, answers, userInputs, setUserInputs, revealed }) {
  const inputRefs = useRef([]);
  const parts = template.split('___');

  return (
    <span>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < answers.length && (
            revealed ? (
              <span style={{
                display: 'inline-block', margin: '0 4px',
                background: norm(userInputs[i]) === norm(answers[i])
                  ? 'rgba(76,200,100,0.2)' : 'rgba(220,80,80,0.2)',
                border: `1.5px solid ${norm(userInputs[i]) === norm(answers[i]) ? '#4cc864' : '#e05050'}`,
                color: norm(userInputs[i]) === norm(answers[i]) ? '#7ef09a' : '#f08080',
                borderRadius: '6px', padding: '2px 10px',
                minWidth: '80px', textAlign: 'center',
              }}>
                {answers[i]}
                {norm(userInputs[i]) !== norm(answers[i]) && userInputs[i] && (
                  <span style={{ opacity: 0.5, fontSize: '12px', marginLeft: '6px' }}>
                    ({userInputs[i]})
                  </span>
                )}
              </span>
            ) : (
              <input
                ref={el => inputRefs.current[i] = el}
                value={userInputs[i] || ''}
                onChange={e => setUserInputs(prev => {
                  const n = [...prev]; n[i] = e.target.value; return n;
                })}
                onKeyDown={e => {
                  if (e.key === 'Enter' && inputRefs.current[i + 1])
                    inputRefs.current[i + 1].focus();
                }}
                placeholder="?"
                style={{
                  display: 'inline-block', margin: '0 4px', verticalAlign: 'middle',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  borderRadius: '6px', padding: '4px 10px', color: '#f0e6d3',
                  fontFamily: 'Georgia, serif', fontSize: '15px', outline: 'none',
                  width: `${Math.max((answers[i] || '').length * 11 + 28, 80)}px`,
                }}
              />
            )
          )}
        </span>
      ))}
    </span>
  );
}
