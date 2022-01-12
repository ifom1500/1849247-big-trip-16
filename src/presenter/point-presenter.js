import TripPointView from '../view/trip-point-view.js';
import FormCreateEditView from '../view/form-create-edit-view.js';

import { RenderPosition, render, replace, remove } from '../utils/render.js';
import { isEscapeEvent } from '../utils/common.js';
import { allOffersMap } from '../mock/trip-point.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #container = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #destinations = [];

  #mode = Mode.DEFAULT;
  #changeMode = null;

  constructor(container, changeMode) {
    this.#container = container;
    this.#changeMode = changeMode;
  }

  init = (point, destinations) => {
    // записываем параметры в свойства презентера
    this.#point = point;
    this.#destinations = [...destinations];

    // записываем исходное состояние копмонентов
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    // создаем экземпляры вьюшек
    this.#pointComponent = new TripPointView(this.#point);
    this.#pointEditComponent = new FormCreateEditView(this.#point, this.#destinations, allOffersMap, { isNew: false });

    // вешаем обработчики
    this.#pointComponent.setRollupButtonClickHandler(this.#handleEditClick);
    this.#pointEditComponent.setRollupButtonClickHandler(this.#handleCloseClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setResetButtonClickHandler(this.#handleResetButtonClick);

    // отрисовка с нуля
    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#container, this.#pointComponent, RenderPosition.BEFORE_END);
      return;
    }

    // перерисовка, если компонент уже существует
    // возможно нужно удалить
    if (this.#container.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#container.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }


  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }


  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);

    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
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
