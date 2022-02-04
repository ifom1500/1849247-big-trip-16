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

export const comparePointByDay = (pointA, pointB) => pointA.dateFrom - pointB.dateFrom;
export const comparePointByDuration = (pointA, pointB) => (pointB.dateTo - pointB.dateFrom) - (pointA.dateTo - pointA.dateFrom);
export const comparePointByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

// --------------------------

const HOURS = 24;
const MINUTES = 60;
const CHARACTERS_LENGTH = 2;
const PAD_VALUE = '0';

const generateDuration = (days, hours, minutes) => {
  const daysDuration = days ? `${String(days).padStart(CHARACTERS_LENGTH, PAD_VALUE)}D` : '';
  const hoursDuration = hours ? `${String(hours % HOURS).padStart(CHARACTERS_LENGTH, PAD_VALUE)}H` : '';
  const minutesDuration = minutes ? `${String(minutes % MINUTES).padStart(CHARACTERS_LENGTH, PAD_VALUE)}M` : '';

  return `${daysDuration} ${hoursDuration} ${minutesDuration}`.trim();
};

// export const getPointDurationByDiff = (dateFrom, dateTo) => {
//   const minutes = dayjs(dateTo).diff(dateFrom, 'minute');
//   const hours = minutes ? Math.floor(minutes / MINUTES) : 0;
//   const days = hours ? Math.floor(hours / HOURS) : 0;

//   return generateDuration(days, hours, minutes);
// };

export const getPointDurationByMinutes = (minutes) => {
  const hours = minutes ? Math.floor(minutes / MINUTES) : 0;
  const days = hours ? Math.floor(hours / HOURS) : 0;

  return generateDuration(days, hours, minutes);
};
