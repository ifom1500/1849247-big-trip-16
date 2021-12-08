import { createElement } from '../render.js';

const createTripEventsTemplate = () => (
  `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
  </section>`
);

export default class TripEventsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createTripEventsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
