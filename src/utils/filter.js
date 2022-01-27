import {FilterType} from '../utils/const.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => (point.timeEnd - Date.now()) >= 0),
  [FilterType.PAST]: (points) => points.filter((point) => (point.timeStart - Date.now()) < 0),
};
