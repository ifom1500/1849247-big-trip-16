const ESCAPE_KEYS = ['Escape', 'Esc'];

const capitalize = (word) => {
  if (word[0]) {
    return `${word[0].toUpperCase()}${word.slice(1)}`;
  }

  return '';
};

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

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export { capitalize, isEscapeEvent, updateItem, SortType };
