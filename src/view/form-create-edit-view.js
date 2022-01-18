import SmartView from './smart-view.js';
import { capitalize } from '../utils/common.js';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  id: '',
  isFavorite: false,
  type: 'bus', // как константу записать
  offers: [],
};

// ПУНКТ НАЗНАЧЕНИЯ
const createDestinationListTemplate = (destinations) =>
  destinations.map(({ name }) => `<option value="${name}"></option>`).join('');

// ТИП
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

// ОФФЕРЫ
// Генерируем один оффер
const createOfferTemplate = ({ id, title, price, isChecked = false} = {}) => (
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
const createOffersSectionTemplate = (offers) => (
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offers.map(createOfferTemplate).join('')}
    </div>
  </section>`
);

// ИЗОБРАЖЕНИЯ
// Генерируем одно изображение
const createPhotoItemTemplate = ({ src, description }) =>
  `<img class="event__photo" src=${src} alt=${description}>`;

// Собираем все изображение в список. Если нет изображений - не показываем блок
const createPhotoContainerTemplate = (pictures, isPicturesExist) => {
  if (isPicturesExist) {
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
const createFormEditTemplate = (data, destinations, renderedWithCheckboxOffers) => {
  const {
    type,
    dateFrom,
    dateTo,
    destination,
    basePrice,
    isPicturesExist
  } = data;

  const destinationListTemplate = createDestinationListTemplate(destinations);
  const eventTypeListTemplate = createEventTypeListTemplate();
  const offersSectionTemplate = createOffersSectionTemplate(renderedWithCheckboxOffers);

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
            ${eventTypeListTemplate}
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${capitalize(type)}
          </label>
          <input
            class="event__input  event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${destination.name}"
            list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationListTemplate}
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
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">

        ${offersSectionTemplate}

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>

          ${createPhotoContainerTemplate(destination.pictures, isPicturesExist)}
        </section>
      </section>
    </form>
  </li>`;
};

export default class FormCreateEditView extends SmartView {
  #destinations = null;
  #allOffersMap = null;

  constructor(point = BLANK_POINT, destinations, offers) {
    super();

    this.#destinations = destinations;
    this.#allOffersMap = offers;

    // ИНФОРМАЦИЯ -> НАЧАЛЬНОЕ СОТОЯНИЕ
    this._data = FormCreateEditView.parsePointToData(point, this.#destinations);

    this.#setInnerHandlers();
  }

  get template() {
    return createFormEditTemplate (
      this._data,
      this.#destinations,
      this.getRenderedWithCheckboxOffers(this.#allOffersMap[this._data.type] || [], this._data.offers)
    );
  }

  // Получить массив офферов с признаком активности
  getRenderedWithCheckboxOffers = (allOffers, pointOffers) => {
    const renderedOffers = allOffers.reduce((offers, offer) => {
      offers.push({
        ...offer,
        isChecked: pointOffers.some(({ id }) => id === offer.id),
      });
      return offers;
    }, []);

    console.log(renderedOffers);
    return renderedOffers;
  };


  setRollupButtonClickHandler = (callback) => {
    this._callback.rollupButtonClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupButtonClickHandler);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  setResetButtonClickHandler = (callback) => {
    this._callback.resetButtonClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#resetButtonClickHandler);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#changeTypeInputHandler);

    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeDestinationInputHandler);

    this.element.querySelector('.event__input--price').addEventListener('input', this.#changePriceInputHandler);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setRollupButtonClickHandler(this._callback.rollupButtonClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setResetButtonClickHandler(this._callback.resetButtonClick);
  }

  reset = (point) => {
    this.updateData(FormCreateEditView.parsePointToData(point));
  }




  #rollupButtonClickHandler = () => {
    this._callback.rollupButtonClick();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    // СОСТОЯНИЕ В ИНФОРМАЦИЮ
    this._callback.formSubmit(FormCreateEditView.parseDataToPoint(this._data));
  }

  #resetButtonClickHandler = () => {
    this._callback.resetButtonClick();
  }

  #changePriceInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      basePrice: evt.currentTarget.value,
    }, true);
  }

  #changeDestinationInputHandler = (evt) => {
    evt.preventDefault();
    const inputDestination = evt.currentTarget;

    if (this.#destinations.every(({name}) => name !== inputDestination.value)) {
      // Введеного значения нет в массиве пунктов назначений
      this.updateData({
        destination: {
          name: inputDestination.value,
          pictures: [],
          description: '',
        },
        isDescriptionExists: false,
        isPicturesExist: false,
      }, true);
    } else {
      // Такой пункт уже есть в массиве
      const currentDestination = this.#destinations.find(({name}) => name === inputDestination.value);
      this.updateData({
        destination: {...currentDestination},
        isDescriptionExists: !!currentDestination.description,
        isPicturesExist: !!currentDestination.pictures.length,
      });
    }
  }

  #changeTypeInputHandler = (evt) => {
    evt.preventDefault();
    console.log('changeTypeInputHandler');
    console.log('evt.target.value -> ', evt.target.value);
    this.updateData({
      type: evt.target.value,
    });
  }


  // ИНФОРМАЦИЯ -> СОТОЯНИЕ
  // Берем данные точки -> выставляем предикаты
  static parsePointToData = (point, destinations) => {
    const currentDestination = point.destination
      ? destinations.find(({name}) => name === point.destination.name)
      : null;

    return {
      ...point,
      isDescriptionExists: !!currentDestination?.description,
      isPicturesExist: Boolean(currentDestination?.pictures && currentDestination.pictures.length),
      isOffersExist: Boolean(point.offers && point.offers.length),
    };
  };

  // СОСТОЯНИЕ -> ИНФОРМАЦИЯ
  static parseDataToPoint = (data) => {
    const point = {...data};

    delete point.isDescriptionExists;
    delete point.isPicturesExist;
    delete point.isOffersExist;

    return point;
  }
}
