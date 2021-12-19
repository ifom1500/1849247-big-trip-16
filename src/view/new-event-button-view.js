import AbstractView from './abstract-view.js';

const createNewEventButtonTemplate = () =>
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class NewEventButtonView extends AbstractView {
  get template() {
    return createNewEventButtonTemplate();
  }

  setButtonClickHandler = (callback) => {
    this._callback.buttonClick = callback;
    this.element.addEventListener('click', this.#butonClickHandler);
  }

  #butonClickHandler = () => {
    this._callback.buttonClick();
  }
}
