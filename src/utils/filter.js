import { FilterType } from '../utils/const.js';

const filterPointsByFuture = (points, dateNow) => points.filter(({ dateFrom }) => dateFrom > dateNow);
const filterPointsBy = (points, dateNow) => points.filter(({ dateTo }) => dateTo < dateNow);

export const filterTypeToPoint = {
  [FilterType.EVERYTHING]: (points) => points.slice(),
  [FilterType.FUTURE]: (points) => filterPointsByFuture(points, Date.now()),
  [FilterType.PAST]: (points) => filterPointsBy(points, Date.now()),
};
