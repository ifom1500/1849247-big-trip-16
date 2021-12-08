import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const formatPointDuration = (seconds) => {
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

const parseDate = (date) => dayjs(date);

export { formatPointDuration, parseDate };
