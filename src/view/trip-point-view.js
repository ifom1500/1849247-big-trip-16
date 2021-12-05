import dayjs from 'dayjs';
import duration from'dayjs/plugin/duration';
dayjs.extend(duration);

export const createPointTemplate = (point) => {
  const {
    type,
    dateFrom: dateFromObject,
    dateTo: dateToObject,
    destination,
    basePrice,
    offers,
    isFavorite
  } = point;

  const dateFrom = dayjs(dateFromObject);
  const dateTo = dayjs(dateToObject);

  const showDuration = () => {
    const eventDuration = dayjs.duration(dateTo.diff(dateFrom));

    if (eventDuration.days() === 0 && eventDuration.hours() === 0) {
      return eventDuration.format('mm[M]');
    }

    if (eventDuration.days() === 0 && eventDuration.hours() > 0) {
      return eventDuration.format('HH[H] mm[M]');
    }

    return eventDuration.format('DD[D] HH[H] mm[M]');
  };

  const starClassName = isFavorite
    ? 'event__favorite-btn--active'
    : '';

  return `<li class="trip-events__item">
    <div class="event">
      <time
        class="event__date"
        datetime="${dateFrom.format('DD-MM-YYYY')}">${dateFrom.format('MMM D')}</time>
      <div class="event__type">
        <img
          class="event__type-icon"
          width="42"
          height="42"
          src="img/icons/${type}.png"
          alt="Event type icon">
      </div>
      <h3 class="event__title">${type[0].toUpperCase()}${type.slice(1)} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time
            class="event__start-time"
            datetime="${dateFrom}">${dateFrom.format('HH:mm')}</time>
          &mdash;
          <time
            class="event__end-time"
            datetime="${dateTo}">${dateTo.format('HH:mm')}</time>
        </p>
        <p class="event__duration">${showDuration()}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;
        <span class="event__price-value">${basePrice}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        <li class="event__offer">
          <!-- TODO: пока не понимаю как будут присваиваться офферы в point -->
          <span class="event__offer-title">${offers[0].offers[0].title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offers[0].offers[0].price}</span>
        </li>
      </ul>
      <button
        class="event__favorite-btn ${starClassName}"
        type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button
        class="event__rollup-btn"
        type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
