const ESCAPE_KEYS = ['Escape', 'Esc'];

const capitalise = (word) => `${word[0].toUpperCase()}${word.slice(1)}`;

const isEscapeEvent = (evt) => ESCAPE_KEYS.includes(evt.key);

export { capitalise, isEscapeEvent };
