import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const formatPointDuration = (seconds) => {
  const eventDuration = dayjs.duration(seconds);
  let format;
  if (eventDuration.days() > 0) {
    format = 'DD[D] HH[H] mm[M]';
  } else if (eventDuration.hours() > 0) {
    format = 'HH[H] mm[M]';
  } else {
    format = 'mm[M]';
  }

  return eventDuration.format(format);
};

export const parseDate = (date) => dayjs(date);

export const comparePointByStart = (pointA, pointB) => pointA.dateFrom - pointB.dateFrom;
export const comparePointByDuration = (pointA, pointB) => (pointB.dateTo - pointB.dateFrom) - (pointA.dateTo - pointA.dateFrom);
export const comparePointByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
