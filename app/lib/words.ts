// Curated answer pool - well-known programming terms (50+ words)
export const ANSWER_WORDS = [
  // Languages & Frameworks
  'ASYNC', 'AWAIT', 'REACT', 'REDUX', 'SWIFT', 'SCALA',

  // Concepts & Patterns
  'CACHE', 'STACK', 'QUEUE', 'GRAPH', 'ARRAY', 'MUTEX',
  'PROXY', 'STATE', 'MIXIN', 'TRAIT', 'MONAD', 'THUNK',

  // Keywords & Syntax
  'CLASS', 'CONST', 'WHILE', 'THROW', 'BREAK', 'YIELD',
  'SUPER', 'UNION', 'INNER', 'OUTER', 'LOCAL', 'FINAL',

  // Web & Networking
  'FETCH', 'QUERY', 'ROUTE', 'TOKEN', 'HTTPS', 'SPLIT',

  // Data Structures
  'INDEX', 'TABLE', 'TUPLE', 'SLICE', 'SCOPE', 'CHUNK',

  // Operations
  'BUILD', 'MATCH', 'PATCH', 'SHIFT', 'WATCH', 'MERGE',
  'PARSE', 'VALID', 'FLUSH', 'ABORT', 'SPAWN', 'BLOCK',

  // Tools & Utilities
  'BABEL', 'NGINX', 'REDIS', 'DEBUG', 'TRACE', 'SHELL',
];

// Extended valid guesses list - includes answers + more obscure terms
export const VALID_GUESSES = [
  ...ANSWER_WORDS,

  // Additional valid programming terms
  'BYTES', 'CODEC', 'ERROR', 'FLOAT', 'LOGIC', 'MACRO',
  'STDIO', 'REGEX', 'TIMER', 'BRIEF', 'GUARD', 'TRAIT',
  'SCOPE', 'DEFER', 'UNSET', 'BASIC', 'COBOL', 'FORTH',
  'JULIA', 'OCAML', 'PROCS', 'LINTS', 'TESTS', 'SPECS',
  'BENCH', 'HOOKS', 'MOCKS', 'STUBS', 'PORTS', 'SOCKS',
  'FLAGS', 'LOADS', 'DUMPS', 'LINKS', 'NODES', 'EDGES',
  'ROOTS', 'LEAFS', 'TREES', 'HEAPS', 'LISTS', 'DEQUE',
  'HASHS', 'SALTS', 'NONCE', 'PUBLI', 'PRIVA', 'GRIDS',
  'CELLS', 'MAZES', 'PATHS', 'WALKS', 'SORTS', 'SWAPS',
];

/**
 * Get a random word from the answer pool
 */
export const getRandomWord = (): string => {
  return ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)];
};

/**
 * Get daily word based on date
 * Uses days since epoch to ensure same word for all players
 */
export const getDaysSinceEpoch = (): number => {
  const epoch = new Date('2024-01-01');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - epoch.getTime()) / 86400000);
};

export const getDailyWord = (): string => {
  const dayIndex = getDaysSinceEpoch();
  return ANSWER_WORDS[dayIndex % ANSWER_WORDS.length];
};
