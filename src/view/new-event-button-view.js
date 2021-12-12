import { createElement } from '../render.js';

export const createNewEventButtonTemplate = () => ('<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>');

export default class NewEventButtonView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNewEventButtonTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}