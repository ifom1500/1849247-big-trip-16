import { makeCapLetter } from '../utils/utils.js';
import { parseDate } from '../utils/date.js';

// Шаблон для выбора типа точки маршрута из кружочка
// ["taxi", "bus", "train", "ship", "drive", "flight", "check-in", "sightseeing", "restaurant"]
const createEventTypeListTemplate = () => (
  `<fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>

    <div class="event__type-item">
      <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
      <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
      <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
      <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
      <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
      <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
      <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
      <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
      <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
      <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
    </div>
  </fieldset>`
);

// Генерируем один оффер
const createOfferTemplate = ({ id, title, price, isChecked = false } = {}) => (
  `<div class="event__offer-selector">
    <input
      class="event__offer-checkbox  visually-hidden"
      id="${id}"
      type="checkbox"
      name="${title}"
      ${isChecked ? 'checked' : ''}
    >
    <label class="event__offer-label" for="${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`
);

// Собираем все сгенерированные офферы
const createOffersSectionTemlate = (offers) => (
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offers.map(createOfferTemplate).join('')}
    </div>
  </section>`
);

// ИЗОБРАЖЕНИЯ
// Генерируем одно изображение
const createPhotoItemTemplate = ({ src, description } = {}) => `<img class="event__photo" src=${src} alt=${description}>`;

// Собираем все изображение в список. Если нет изображений - не показываем блок
const createPhotoContainerTemplate = (pictures) => {
  if (pictures.length) {
    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures.map(createPhotoItemTemplate).join('')}
        </div>
      </div>`
    );
  }

  return '';
};

// Функция создания шаблона формы редактирования точки
export const createFormCreateTemplate = (point, destinations, allOffers) => {
  const {
    type,
    dateFrom: dateFromObject,
    dateTo: dateToObject,
    destination,
    basePrice,
    offers: tripOffers,
  } = point;

  const renderedOffers = [];

  // Сравниваем общий список офферов с офферами, указанными для точки
  // в пустой массив renderedOffers пушим объект - оффер и признак isChecked
  allOffers.forEach((offer) => {
    const isChecked = tripOffers.some(({ id }) => id === offer.id);

    renderedOffers.push({
      ...offer,
      isChecked,
    });
  });

  // Собираем список вариантов точке назначения для вставки в шаблон
  const destinationList = destinations.map(({ name }) =>
    `<option value="${name}"></option>`).join('');

  const dateFrom = parseDate(dateFromObject);
  const dateTo = parseDate(dateToObject);

  const eventTypeListTemplate = createEventTypeListTemplate();
  const offersSectionTemlate = createOffersSectionTemlate(renderedOffers);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img
              class="event__type-icon"
              width="17"
              height="17"
              src="img/icons/${type}.png"
              alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            ${eventTypeListTemplate};
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${makeCapLetter(type)}
          </label>
          <input
            class="event__input  event__input--destination"
            id="event-destination-1" type="text"
            name="event-destination"
            value="${destination.name}"
            list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationList}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input
            class="event__input  event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            value="${dateFrom.format('DD/MM/YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input
            class="event__input  event__input--time"
            id="event-end-time-1"
            type="text"
            name="event-end-time"
            value="${dateTo.format('DD/MM/YY HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input  event__input--price"
            id="event-price-1"
            type="text"
            name="event-price"
            value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">

        ${offersSectionTemlate}

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>

          ${createPhotoContainerTemplate(destination.pictures)}
        </section>
      </section>
    </form>
  </li>`;
};
