import dayjs from 'dayjs';
import { PointType, ESCAPE_KEYS } from '../utils/const.js';

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

export { capitalize, isEscapeEvent, getLocalPoint };
