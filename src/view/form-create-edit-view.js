// import he from 'he';
import SmartView from './smart-view.js';
import { capitalize } from '../utils/common.js';
import { parseDate } from '../utils/date.js';
import { PointType } from '../utils/common.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const POINT_TYPES = Object.values(PointType);

const createEventTypeListTemplate = (currentType, pointTypes) => (
  pointTypes.map((type) => (
    `<div class="event__type-item">
      <input
        id="event-type-${type}-1"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${type}"
        ${type === currentType ? 'checked' : ''}
      >
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalize(type)}</label>
    </div>`)
  ).join('')
);

const createDestinationListTemplate = (destinationNames) =>
  destinationNames.map((name) => `<option value="${name}"></option>`).join('');

const createOfferTemplate = ({ id, title, price, isChecked = false} = {}) => (
  `<div class="event__offer-selector">
    <input
      class="event__offer-checkbox  visually-hidden"
      id="${id}"
      type="checkbox"
      name="${title}"
      ${isChecked ? 'checked' : ''}
      data-price="${price}"
    >
    <label class="event__offer-label" for="${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`
);

const createOffersSectionTemplate = (offers, isOffersExist) => (
  isOffersExist
    ? `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offers.map(createOfferTemplate).join('')}
      </div>
    </section>`
    : ''
);

const createPhotoItemTemplate = ({ src, description }) => (`<img class="event__photo" src=${src} alt=${description}>`);

const createDestinationSectionTemplate = (destination, isDescriptionExist, isPicturesExist) => (
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>

    ${isDescriptionExist
    ? `<p class="event__destination-description">${destination.description}</p>`
    : ''}

    ${isPicturesExist
    ? `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${destination.pictures.map(createPhotoItemTemplate).join('')}
      </div>
    </div>`
    : ''}
  </section>`
);

const createRollupButtonTemplate = () => (
  `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`
);

const createFormEditTemplate = (data) => {
  const {
    type,
    offers,
    dateFrom,
    dateTo,
    destination,
    basePrice,
    destinationNames,
    isDestinationExist,
    isDescriptionExist,
    isPicturesExist,
    isOffersExist,
    isNew,
    isDisabled,
    isSaving, // TODO:
  } = data;

  const resetButtonName = isNew ? 'Cancel' : 'Delete';

  const rollupButtonTemplate = isNew ? '' : createRollupButtonTemplate();
  const eventTypeListTemplate = createEventTypeListTemplate(type, POINT_TYPES);
  const destinationListTemplate = createDestinationListTemplate(destinationNames);
  const offersSectionTemplate = createOffersSectionTemplate(offers, isOffersExist);
  const destinationSectionTemplate = isDestinationExist
    ? createDestinationSectionTemplate(destination, isDescriptionExist, isPicturesExist) :
    '';

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
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${eventTypeListTemplate}
            </fieldset>
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
            list="destination-list-1"
            required
          >
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
            type="number"
            name="event-price"
            min="1"
            value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>Save</button>
        <button class="event__reset-btn" type="reset">${resetButtonName}</button>
        ${rollupButtonTemplate}
      </header>
      <section class="event__details">

        ${offersSectionTemplate}

        ${destinationSectionTemplate}
      </section>
    </form>
  </li>`;
};

export default class FormCreateEditView extends SmartView {
  #startDatePicker = null;
  #endDatePicker = null;

  #destinations = null;
  #allOffersMap = null;

  constructor(point, destinations, offers, { isNew = false }) {
    super();

    this.#destinations = destinations;
    this.#allOffersMap = offers;

    this._data = FormCreateEditView.parsePointToData(point, destinations, offers, isNew);

    this.#setInnerHandlers();
  }

  get template() {
    return createFormEditTemplate(this._data);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  setDeleteButtonClickHandler = (callback) => {
    this._callback.deleteButtonClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler);
  }

  setCancelClickHandler = (callback) => {
    this.setDeleteButtonClickHandler(callback);
  }

  setRollupButtonClickHandler = (callback) => {
    const rollupButton = this.element.querySelector('.event__rollup-btn');
    if (rollupButton === null) {
      return;
    }

    this._callback.rollupButtonClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupButtonClickHandler);
  }

  #setInnerHandlers = () => {
    const element = this.element;
    const destinationInput = element.querySelector('.event__input--destination');

    destinationInput.addEventListener('change', this.#destinationInputChangeHandler);
    destinationInput.addEventListener('focus', this.#destinationInputFocusHandler);

    destinationInput.addEventListener('keydown', this.#destinationInputKeydownHandler);

    element.querySelector('.event__type-group').addEventListener('change', this.#typeInputChangeHandler);
    element.querySelector('.event__input--price').addEventListener('input', this.#priceInputChangeHandler);

    this.#setDatePickers();
  }

  #setStartDatePicker = () => {
    this.#startDatePicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        maxDate: this._data.dateTo ? this._data.dateTo.toISOString() : '',
        onChange: this.#startDateChangeHandler,
      }
    );
  }

  #setEndDatePicker = () => {
    this.#endDatePicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: this._data.dateFrom ? this._data.dateFrom.toISOString() : '',
        onChange: this.#endDateChangeHandler,
      }
    );
  }

  #setDatePickers = () => {
    this.#setStartDatePicker();
    this.#setEndDatePicker();
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();

    this.setRollupButtonClickHandler(this._callback.rollupButtonClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteButtonClickHandler(this._callback.deleteButtonClick);
  }

  reset = (point) => {
    this.updateData(FormCreateEditView.parsePointToData(
      point, this.#destinations, this.#allOffersMap
    ), false);
  }

  #removeDatePickers = () => {
    if (this.#startDatePicker) {
      this.#startDatePicker.destroy();
      this.#startDatePicker = null;
    }

    if (this.#endDatePicker) {
      this.#endDatePicker.destroy();
      this.#endDatePicker = null;
    }
  }

  removeElement = () => {
    super.removeElement();
    this.#removeDatePickers();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    const offers = [];
    const checkedOffers = this.element.querySelectorAll('.event__offer-checkbox:checked');

    checkedOffers.forEach((offerElement) => {
      offers.push(
        {
          id: +offerElement.id,
          title: offerElement.name,
          price: +offerElement.dataset.price,
        }
      );
    });

    const point = FormCreateEditView.parseDataToPoint(this._data);
    point.offers = offers;

    this._callback.formSubmit(point);
  }

  #destinationInputFocusHandler = (evt) => {
    const target =  evt.target;

    target.placeholder = target.value;
    target.value = '';

    target.addEventListener('blur', () => {
      target.value = target.placeholder;
    }, {once: true});
  };

  #destinationInputKeydownHandler = (evt) => {
    evt.preventDefault();
  };

  #rollupButtonClickHandler = () => {
    this._callback.rollupButtonClick();
  }

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteButtonClick(/* TaskEditView.parseDataToTask(this._data) **/);
    // так в демо проекте 7.1.6
  }

  #priceInputChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({basePrice: evt.target.valueAsNumber}, true);
  }

  #destinationInputChangeHandler = (evt) => {
    evt.preventDefault();

    const destinationName = evt.target.value;
    const destination = this.#destinations.find(({name}) => name === destinationName);

    if (!destination) {
      return;
    }

    this.updateData({
      destination,
      isDescriptionExist: !!destination.description,
      isPicturesExist: !!destination.pictures.length,
      isDestinationExist: !!destination.description || !!destination.pictures.length,
    }, false);
  }

  #typeInputChangeHandler = (evt) => {
    evt.preventDefault();

    const type = evt.target.value;
    const typeOffers = this.#allOffersMap.get(type) ?? [];
    const offers = FormCreateEditView.getRenderedWithCheckboxOffers([], typeOffers);

    const isOffersExist = offers.length > 0;

    this.updateData({type, offers, isOffersExist}, false);
  }

  #startDateChangeHandler = ([newStartDate]) => {
    // newStartDate = [Wed Jul 03 2019 01:55:00 GMT+0300 (Москва, стандартное время)]

    // TODO:
    /**
    const newStartDateConverted = parseDate(newStartDate);
    this.updateData({dateFrom: newStartDateConverted}, true);
    this.#endDatePicker.destroy();
    this.#endDatePicker = null;
    this.#setEndDatePicker();
    */

    // См:
    // https://flatpickr.js.org/options/#:~:text=pick%20to%20(inclusive).-,minDate,-String/Date
    // https://flatpickr.js.org/instance-methods-properties-elements/#:~:text=in%20most%20cases.-,set(option%2C%20value),-%23

    // TODO: желательно так же сделать в другом: #endDateChangeHandler
    this.#endDatePicker.set('minDate', newStartDate);
  }

  #endDateChangeHandler = (newEndDate) => {
    const newEndDateConverted = parseDate(newEndDate);
    this.updateData({dateTo: newEndDateConverted}, true);
    this.#setStartDatePicker();
  };

  static getRenderedWithCheckboxOffers = (pointOffers, allOffers) => {
    const renderedOffers = allOffers.reduce((offers, offer) => {
      offers.push({
        ...offer,
        isChecked: pointOffers.some(({ id }) => id === offer.id),
      });

      return offers;
    }, []);

    return renderedOffers;
  };

  static parsePointToData = (point, destinations, allOffersMap, isNew) => {
    const {
      type,
      offers,
      destination: { description, pictures },
    } = point;

    const typeOffers = allOffersMap.get(type) ?? [];
    const dataOffers = FormCreateEditView.getRenderedWithCheckboxOffers(offers, typeOffers);

    const isDescriptionExist = description !== '';
    const isPicturesExist = pictures.length > 0;
    const isOffersExist = dataOffers.length > 0;

    return {
      ...point,
      offers: dataOffers,
      destinationNames: destinations.map(({ name }) => name),
      isDestinationExist: isDescriptionExist || isPicturesExist,
      isDescriptionExist,
      isPicturesExist,
      isOffersExist,
      isNew,
      isDisabled: false,
      isSaving: false,
    };
  };

  static parseDataToPoint = (data) => {
    const point = {...data};

    delete point.isDestinationExist;
    delete point.isDescriptionExist;
    delete point.isPicturesExist;
    delete point.isOffersExist;
    delete point.destinationNames;
    delete point.isNew;

    return point;
  }
}
