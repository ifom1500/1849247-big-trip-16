const ESCAPE_KEYS = ['Escape', 'Esc'];

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const PointType = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant',
};

const capitalize = (text) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

const isEscapeEvent = (evt) => ESCAPE_KEYS.includes(evt.key);

// больше не нужна, весь функционал в модели
// const updateItem = (items, update) => {
//   const index = items.findIndex((item) => item.id === update.id);

//   if (index === -1) {
//     return items;
//   }

//   return [
//     ...items.slice(0, index),
//     update,
//     ...items.slice(index + 1),
//   ];
// };

const getBlankPoint = (parseDateCallback) => (
  {
    basePrice: 0,
    dateFrom: parseDateCallback(),
    dateTo: parseDateCallback(),
    destination: null,
    id: '',
    isFavorite: false,
    type: PointType.BUS,
    offers: [],
  }
);

export { capitalize, isEscapeEvent, /*updateItem,**/ SortType, PointType, getBlankPoint };
