import { createElement } from '../render.js';

const createEmptyListTemplate = () => (
  `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>

    <p class="trip-events__msg">Click New Event to create your first point</p>`

  /*
  * Значение отображаемого текста зависит от выбранного фильтра:
  * - Everthing – 'Click New Event to create your first point'
  * - Past — 'There are no past events now';
  * - Future — 'There are no future events now'.
  **/
);

export default class EmptyListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createEmptyListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
