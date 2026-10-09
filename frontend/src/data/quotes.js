// quotes.js
// 100 motivational quotes curated for students.
// Covers: focus, discipline, resilience, academic pressure,
// consistency, rest, self-belief, and starting before you feel ready.
// Usage: import quotes, { getDailyQuote, getRandomQuote, getQuotesByCategory } from './quotes';

const quotes = [
  // — Focus & Deep Work —
  {
    id: 1,
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "focus"
  },
  {
    id: 2,
    text: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.",
    author: "Alexander Graham Bell",
    category: "focus"
  },
  {
    id: 3,
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    category: "focus"
  },
  {
    id: 4,
    text: "Do the hard jobs first. The easy jobs will take care of themselves.",
    author: "Dale Carnegie",
    category: "focus"
  },
  {
    id: 5,
    text: "One task at a time. One hour at a time. One day at a time. That is how mountains are moved.",
    author: "Unknown",
    category: "focus"
  },
  {
    id: 6,
    text: "Where focus goes, energy flows.",
    author: "Tony Robbins",
    category: "focus"
  },
  {
    id: 7,
    text: "The difference between ordinary and extraordinary is that little extra.",
    author: "Jimmy Johnson",
    category: "focus"
  },
  {
    id: 8,
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
    category: "focus"
  },
  {
    id: 9,
    text: "It's not that I'm so smart, it's just that I stay with problems longer.",
    author: "Albert Einstein",
    category: "focus"
  },
  {
    id: 10,
    text: "The mind is everything. What you think, you become.",
    author: "Buddha",
    category: "focus"
  },

  // — Discipline & Consistency —
  {
    id: 11,
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    category: "discipline"
  },
  {
    id: 12,
    text: "Motivation gets you going. Discipline keeps you growing.",
    author: "John C. Maxwell",
    category: "discipline"
  },
  {
    id: 13,
    text: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.",
    author: "John C. Maxwell",
    category: "discipline"
  },
  {
    id: 14,
    text: "You don't rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    category: "discipline"
  },
  {
    id: 15,
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
    category: "discipline"
  },
  {
    id: 16,
    text: "The most certain way to succeed is always to try just one more time.",
    author: "Thomas Edison",
    category: "discipline"
  },
  {
    id: 17,
    text: "Consistency is the hallmark of the unimaginative.",
    author: "Oscar Wilde",
    category: "discipline"
  },
  {
    id: 18,
    text: "Talent without discipline is like an octopus on roller skates.",
    author: "H. Jackson Brown Jr.",
    category: "discipline"
  },
  {
    id: 19,
    text: "With self-discipline, most anything is possible.",
    author: "Theodore Roosevelt",
    category: "discipline"
  },
  {
    id: 20,
    text: "A year from now you may wish you had started today.",
    author: "Karen Lamb",
    category: "discipline"
  },

  // — Academic Pressure & Student Life —
  {
    id: 21,
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "W.B. Yeats",
    category: "student"
  },
  {
    id: 22,
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King",
    category: "student"
  },
  {
    id: 23,
    text: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.",
    author: "Richard Feynman",
    category: "student"
  },
  {
    id: 24,
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
    category: "student"
  },
  {
    id: 25,
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
    category: "student"
  },
  {
    id: 26,
    text: "Don't let what you cannot do interfere with what you can do.",
    author: "John Wooden",
    category: "student"
  },
  {
    id: 27,
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    category: "student"
  },
  {
    id: 28,
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    category: "student"
  },
  {
    id: 29,
    text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    author: "Malcolm X",
    category: "student"
  },
  {
    id: 30,
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert",
    category: "student"
  },

  // — Resilience & Overcoming Failure —
  {
    id: 31,
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "resilience"
  },
  {
    id: 32,
    text: "Our greatest glory is not in never falling, but in rising every time we fall.",
    author: "Confucius",
    category: "resilience"
  },
  {
    id: 33,
    text: "Failure is simply the opportunity to begin again, this time more intelligently.",
    author: "Henry Ford",
    category: "resilience"
  },
  {
    id: 34,
    text: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "Thomas Edison",
    category: "resilience"
  },
  {
    id: 35,
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    category: "resilience"
  },
  {
    id: 36,
    text: "You may encounter many defeats, but you must not be defeated.",
    author: "Maya Angelou",
    category: "resilience"
  },
  {
    id: 37,
    text: "The harder the battle, the sweeter the victory.",
    author: "Les Brown",
    category: "resilience"
  },
  {
    id: 38,
    text: "Rock bottom became the solid foundation on which I rebuilt my life.",
    author: "J.K. Rowling",
    category: "resilience"
  },
  {
    id: 39,
    text: "Storms make trees take deeper roots.",
    author: "Dolly Parton",
    category: "resilience"
  },
  {
    id: 40,
    text: "Even the darkest night will end and the sun will rise.",
    author: "Victor Hugo",
    category: "resilience"
  },

  // — Starting Before You're Ready —
  {
    id: 41,
    text: "You don't have to feel motivated to start. You just have to start.",
    author: "Unknown",
    category: "starting"
  },
  {
    id: 42,
    text: "Begin anywhere.",
    author: "John Cage",
    category: "starting"
  },
  {
    id: 43,
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "starting"
  },
  {
    id: 44,
    text: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
    category: "starting"
  },
  {
    id: 45,
    text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne",
    category: "starting"
  },
  {
    id: 46,
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
    category: "starting"
  },
  {
    id: 47,
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "starting"
  },
  {
    id: 48,
    text: "Done is better than perfect.",
    author: "Sheryl Sandberg",
    category: "starting"
  },
  {
    id: 49,
    text: "All great achievements require time.",
    author: "Maya Angelou",
    category: "starting"
  },
  {
    id: 50,
    text: "A journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
    category: "starting"
  },

  // — Self-Belief & Confidence —
  {
    id: 51,
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "self-belief"
  },
  {
    id: 52,
    text: "Whether you think you can or think you can't, you're right.",
    author: "Henry Ford",
    category: "self-belief"
  },
  {
    id: 53,
    text: "You are capable of more than you know.",
    author: "E.O. Wilson",
    category: "self-belief"
  },
  {
    id: 54,
    text: "No one can make you feel inferior without your consent.",
    author: "Eleanor Roosevelt",
    category: "self-belief"
  },
  {
    id: 55,
    text: "The only person you should try to be better than is the person you were yesterday.",
    author: "Unknown",
    category: "self-belief"
  },
  {
    id: 56,
    text: "You have within you right now, everything you need to deal with whatever the world throws at you.",
    author: "Brian Tracy",
    category: "self-belief"
  },
  {
    id: 57,
    text: "Doubt kills more dreams than failure ever will.",
    author: "Suzy Kassem",
    category: "self-belief"
  },
  {
    id: 58,
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    category: "self-belief"
  },
  {
    id: 59,
    text: "You were not born to be average.",
    author: "Unknown",
    category: "self-belief"
  },
  {
    id: 60,
    text: "Trust the process. Your time is coming.",
    author: "Unknown",
    category: "self-belief"
  },

  // — Time & Prioritisation —
  {
    id: 61,
    text: "Time is what we want most, but what we use worst.",
    author: "William Penn",
    category: "time"
  },
  {
    id: 62,
    text: "Lost time is never found again.",
    author: "Benjamin Franklin",
    category: "time"
  },
  {
    id: 63,
    text: "The key is not to prioritise what's on your schedule, but to schedule your priorities.",
    author: "Stephen Covey",
    category: "time"
  },
  {
    id: 64,
    text: "Ordinary people think merely of spending time. Great people think of using it.",
    author: "Arthur Schopenhauer",
    category: "time"
  },
  {
    id: 65,
    text: "You will never find time for anything. If you want time, you must make it.",
    author: "Charles Buxton",
    category: "time"
  },
  {
    id: 66,
    text: "Either run the day or the day runs you.",
    author: "Jim Rohn",
    category: "time"
  },
  {
    id: 67,
    text: "The bad news is time flies. The good news is you're the pilot.",
    author: "Michael Altshuler",
    category: "time"
  },
  {
    id: 68,
    text: "Don't count the days. Make the days count.",
    author: "Muhammad Ali",
    category: "time"
  },
  {
    id: 69,
    text: "How you spend your time is how you spend your life.",
    author: "Unknown",
    category: "time"
  },
  {
    id: 70,
    text: "Procrastination is the thief of time, collar him.",
    author: "Charles Dickens",
    category: "time"
  },

  // — Progress Over Perfection —
  {
    id: 71,
    text: "Progress, not perfection.",
    author: "Unknown",
    category: "progress"
  },
  {
    id: 72,
    text: "Don't wait until everything is just right. It will never be perfect.",
    author: "Mark Victor Hansen",
    category: "progress"
  },
  {
    id: 73,
    text: "Little by little, one travels far.",
    author: "J.R.R. Tolkien",
    category: "progress"
  },
  {
    id: 74,
    text: "No matter how slow you go, you are still lapping everybody on the couch.",
    author: "Unknown",
    category: "progress"
  },
  {
    id: 75,
    text: "Every accomplishment starts with the decision to try.",
    author: "John F. Kennedy",
    category: "progress"
  },
  {
    id: 76,
    text: "Fall seven times, stand up eight.",
    author: "Japanese Proverb",
    category: "progress"
  },
  {
    id: 77,
    text: "You don't need to see the whole staircase, just take the first step.",
    author: "Martin Luther King Jr.",
    category: "progress"
  },
  {
    id: 78,
    text: "Keep going. Everything you need will come to you at the perfect time.",
    author: "Unknown",
    category: "progress"
  },
  {
    id: 79,
    text: "Small steps every day add up to miles at the end of the year.",
    author: "Unknown",
    category: "progress"
  },
  {
    id: 80,
    text: "Sweat is just fat crying. Keep going.",
    author: "Unknown",
    category: "progress"
  },

  // — Rest & Mental Wellness —
  {
    id: 81,
    text: "Almost everything will work again if you unplug it for a few minutes — including you.",
    author: "Anne Lamott",
    category: "rest"
  },
  {
    id: 82,
    text: "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit.",
    author: "Ralph Marston",
    category: "rest"
  },
  {
    id: 83,
    text: "Taking care of yourself doesn't mean me first, it means me too.",
    author: "L.R. Knost",
    category: "rest"
  },
  {
    id: 84,
    text: "You owe yourself the love that you so freely give to other people.",
    author: "Unknown",
    category: "rest"
  },
  {
    id: 85,
    text: "Rest is not idleness, and to lie sometimes on the grass under trees is by no means a waste of time.",
    author: "John Lubbock",
    category: "rest"
  },
  {
    id: 86,
    text: "Burnout is not a badge of honour.",
    author: "Unknown",
    category: "rest"
  },
  {
    id: 87,
    text: "Your mental health is more important than your grades.",
    author: "Unknown",
    category: "rest"
  },
  {
    id: 88,
    text: "Slow down. You are not falling behind — you are finding your pace.",
    author: "Unknown",
    category: "rest"
  },
  {
    id: 89,
    text: "A calm mind brings inner strength and self-confidence.",
    author: "Dalai Lama",
    category: "rest"
  },
  {
    id: 90,
    text: "You cannot pour from an empty cup. Take care of yourself first.",
    author: "Unknown",
    category: "rest"
  },

  // — African & Nigerian Context —
  {
    id: 91,
    text: "If you want to go fast, go alone. If you want to go far, go together.",
    author: "African Proverb",
    category: "community"
  },
  {
    id: 92,
    text: "Rain does not fall on one roof alone.",
    author: "African Proverb",
    category: "community"
  },
  {
    id: 93,
    text: "A child who is not embraced by the village will burn it down to feel its warmth.",
    author: "African Proverb",
    category: "community"
  },
  {
    id: 94,
    text: "No condition is permanent. Keep building.",
    author: "Nigerian Saying",
    category: "community"
  },
  {
    id: 95,
    text: "The forest would be silent if no bird sang except those that sang best.",
    author: "African Proverb",
    category: "community"
  },
  {
    id: 96,
    text: "He who learns, teaches.",
    author: "Ethiopian Proverb",
    category: "community"
  },
  {
    id: 97,
    text: "Knowledge is like a garden: if it is not cultivated, it cannot be harvested.",
    author: "African Proverb",
    category: "community"
  },
  {
    id: 98,
    text: "However long the night, the dawn will break.",
    author: "African Proverb",
    category: "community"
  },
  {
    id: 99,
    text: "Arise, shine — your light has come.",
    author: "Isaiah 60:1",
    category: "community"
  },
  {
    id: 100,
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "resilience"
  }
];

// Seed-based utility — same quote shows all day, changes next day
export function getDailyQuote() {
  const today = new Date().toDateString();
  let seed = 0;
  for (let i = 0; i < today.length; i++) {
    seed += today.charCodeAt(i);
  }
  return quotes[seed % quotes.length];
}

// Get a random quote (for manual refresh)
export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Get quotes by category
export function getQuotesByCategory(category) {
  return quotes.filter(q => q.category === category);
}

export default quotes;
