import AbstractView from './abstract-view.js';

const createPointMessageTemplate = (message) => (
  `<p class="trip-events__msg">${message}</p>`
);

export default class PointMessageView extends AbstractView {
  #message = '';

  constructor(message) {
    super();

    this.#message = message;
  }

  get template() {
    return createPointMessageTemplate(this.#message);
  }
}
