import dayjs from 'dayjs';

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

const getLocalPoint = () => ({
  basePrice: 0,
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
  isFavorite: false,
  type: PointType.BUS,
  offers: [],
});

export { capitalize, isEscapeEvent, SortType, PointType, getLocalPoint };
