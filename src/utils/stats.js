import { POINT_TYPES } from '../utils/const.js';

const makeStatsSorter = (value) => (a, b) => b[value] - a[value];
const makeStatsReducer = (value) =>
  (stats, { type, ...values}) => {
    stats.labels.push(type);
    stats.data.push(values[value]);

    return stats;
  };

const sortByPrice = makeStatsSorter('price');
const sortByTime = makeStatsSorter('time');
const sortByType = makeStatsSorter('used');

const reduceStatsPrice = makeStatsReducer('price');
const reduceStatsTime = makeStatsReducer('time');
const reduceStatsType = makeStatsReducer('used');

export const getMoneyData = (stats) => stats
  .sort(sortByPrice)
  .reduce(reduceStatsPrice, { labels: [], data: [] });

export const getTypeData = (stats) => stats
  .sort(sortByType)
  .reduce(reduceStatsType, { labels: [], data: [] });

export const getTimeData = (stats) => stats
  .sort(sortByTime)
  .reduce(reduceStatsTime, { labels: [], data: [] });

const createEmptyStats = (types) =>
  types.reduce((stat, type) => {
    stat[type] = { type, used: 0, price: 0, time: 0 };
    return stat;
  }, {});

export const getStats = (points) => {
  const stats = createEmptyStats(POINT_TYPES);

  points.forEach(({ type, basePrice, dateFrom, dateTo }) => {
    const stat = stats[type];

    stat.used += 1;
    stat.price += basePrice;
    stat.time += dateTo - dateFrom;
  });

  return Object.values(stats);
};
