import AbstractView from './abstract-view.js';
import { FilterType } from '../utils/const.js';

const filterTypeToMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const createEmptyListTemplate = (filterType) => (
  `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
    <p class="trip-events__msg">${filterTypeToMessage[filterType] ?? ''}</p>
  </section>`
);

export default class EmptyListView extends AbstractView {
  #filterType = '';

  constructor(filterType) {
    super();

    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
