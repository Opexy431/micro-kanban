// src/components/QuoteDisplay.jsx
import { useState } from 'react';
import { getDailyQuote, getRandomQuote } from '../data/quotes';

export function QuoteDisplay() {
  const [quote, setQuote] = useState(() => getDailyQuote());

  const handleNextQuote = () => {
    setQuote(getRandomQuote());
  };

  return (
    <div className="quote-card">
      <p className="quote-text">"{quote.text}"</p>
      <p className="quote-author">— {quote.author}</p>
      <div className="quote-actions">
        <span className="quote-badge">{quote.category}</span>
        <button 
          type="button" 
          onClick={handleNextQuote} 
          className="quote-refresh-btn"
          title="Show another quote"
        >
          ✨ Refresh Quote
        </button>
      </div>
    </div>
  );
}

export default QuoteDisplay;
