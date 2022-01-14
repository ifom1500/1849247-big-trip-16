const ESCAPE_KEYS = ['Escape', 'Esc'];

const capitalize = (text) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

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
