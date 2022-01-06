import TripPointView from '../view/trip-point-view.js';
import FormCreateEditView from '../view/form-create-edit-view.js';

import { render, replace, remove } from '../utils/render.js';
import { isEscapeEvent } from '../utils/common.js';
import { allOffersMap } from '../mock/trip-point.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #eventsListElement = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #renderPosition = null;
  #mode = null;
  #destinations = [];


  constructor(eventsListElement) {
    this.#eventsListElement = eventsListElement;
  }

  init = (point, renderPosition, mode, destinations) => {
    // записываем параметры в свойства презентера
    this.#point = point;
    this.#renderPosition = renderPosition;
    this.#mode = mode;
    this.#destinations = [...destinations];

    // записываем исходное состояние копмонентов
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    // создаем экземпляры вьюшек
    this.#pointComponent = new TripPointView(this.#point);
    this.#pointEditComponent = new FormCreateEditView(this.#point, this.#destinations, allOffersMap, this.#mode);

    // вешаем обработчики
    this.#pointComponent.setRollupButtonClickHandler(this.#handleEditClick);
    this.#pointEditComponent.setRollupButtonClickHandler(this.#handleCloseClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setResetButtonClickHandler(this.#handleResetButtonClick);

    // отрисовка с нуля
    if (prevPointComponent === null || prevPointEditComponent === null) {
      if (this.#mode) {
        render(this.#eventsListElement, this.#pointEditComponent, this.#renderPosition);
      } else {
        render(this.#eventsListElement, this.#pointComponent, this.#renderPosition);
      }
      return;
    }

    // перерисовка, если компонент уже существует
    if (this.#eventsListElement.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#eventsListElement.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
  }

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }

  #handleEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleCloseClick = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleResetButtonClick = () => {
    remove(this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }
}
