const ESCAPE_KEYS = ['Escape', 'Esc'];

const capitalise = (word) => `${word[0].toUpperCase()}${word.slice(1)}`;

const isEscapeEvent = (evt) => ESCAPE_KEYS.includes(evt.key);

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export { capitalise, isEscapeEvent, updateItem };
