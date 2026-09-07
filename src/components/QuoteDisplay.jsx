// src/components/QuoteDisplay.jsx
import { useState, useEffect } from 'react';
import { getRandomQuote, getDailyQuote } from '../data/quotes';

export function QuoteDisplay({ autoIntervalSeconds = 15 }) {
  const [quote, setQuote] = useState(() => getDailyQuote());
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (isPaused) return;

    const intervalStep = 100; // update progress every 100ms
    const totalSteps = (autoIntervalSeconds * 1000) / intervalStep;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Trigger quote change with smooth fade
          setFade(false);
          setTimeout(() => {
            setQuote(getRandomQuote());
            setFade(true);
          }, 250);
          return 0;
        }
        return prev + (100 / totalSteps);
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPaused, autoIntervalSeconds]);

  const handleNextQuote = () => {
    setFade(false);
    setTimeout(() => {
      setQuote(getRandomQuote());
      setProgress(0);
      setFade(true);
    }, 200);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <div 
      className="quote-card"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Auto-timer Progress Line */}
      <div className="quote-progress-track">
        <div 
          className="quote-progress-bar" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <div className={`quote-content ${fade ? 'fade-in' : 'fade-out'}`}>
        <p className="quote-text">"{quote.text}"</p>
        <p className="quote-author">— {quote.author}</p>
      </div>

      <div className="quote-actions">
        <span className="quote-badge">
          🏷️ {quote.category} {isPaused && '(Paused)'}
        </span>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            type="button" 
            onClick={togglePause} 
            className="quote-btn-pill"
            title={isPaused ? "Resume auto-changing quotes" : "Pause on this quote"}
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button 
            type="button" 
            onClick={handleNextQuote} 
            className="quote-btn-pill"
            title="Next quote now"
          >
            ✨ Next Quote
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuoteDisplay;
