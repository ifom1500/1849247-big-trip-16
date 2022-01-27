import AbstractView from './abstract-view.js';
import { FilterType } from '../utils/const.js';

const EmptyListMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const createEmptyListTemplate = (filterType) => {
  const EmptyListTextValue = EmptyListMessage[filterType];

  return `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>

    <p class="trip-events__msg">
      ${EmptyListTextValue}
    </p>`;
};

export default class EmptyListView extends AbstractView {
  constructor(data) {
    super();

    this._data = data;
  }

  get template() {
    return createEmptyListTemplate(this._data);
  }
}
