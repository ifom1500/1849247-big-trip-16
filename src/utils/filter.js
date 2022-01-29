import { FilterType } from '../utils/const.js';

const filterPointsByFuture = (points, dateNow) => points.filter(({ dateFrom }) => dateFrom > dateNow);
const filterPointsBy = (points, dateNow) => points.filter(({ dateTo }) => dateTo < dateNow);

export const filterTypeToPoint = {
  [FilterType.EVERYTHING]: (points) => points.slice(),
  [FilterType.FUTURE]: (points) => filterPointsByFuture(points, Date.now()),
  [FilterType.PAST]: (points) => filterPointsBy(points, Date.now()),
};


// TODO: Можно скрыть работу со словарем за интерфейсом функции:
//  filter ->  filterPoints / filterPointByType
//  = (points, filterType = FilterType.EVERYTHING) => filter[filterType](points);

// const UPDA_DATE = 2;
// Date.now = () => new Date(...)
// filter[FilterType.PAST](points) =>
