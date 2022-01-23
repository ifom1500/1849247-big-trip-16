import TripPointView from '../view/trip-point-view.js';
import FormCreateEditView from '../view/form-create-edit-view.js';

import { RenderPosition, render, replace, remove } from '../utils/render.js';
import { isEscapeEvent } from '../utils/common.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #container = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #allOffersMap = [];

  #mode = Mode.DEFAULT;
  #changeMode = null;
  #changeData = null;

  constructor(container, changeData, changeMode, allOffersMap) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#allOffersMap = allOffersMap;
  }

  init = (point, destinations) => {
    // записываем параметры в свойства презентера
    this.#point = point;

    // записываем исходное состояние копмонентов
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    // создаем экземпляры вьюшек
    this.#pointComponent = new TripPointView(this.#point);
    this.#pointEditComponent = new FormCreateEditView(this.#point, destinations, this.#allOffersMap, { isNew: false });

    // вешаем обработчики
    this.#pointComponent.setRollupButtonClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#pointEditComponent.setRollupButtonClickHandler(this.#handleCloseClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setResetButtonClickHandler(this.#handleResetButtonClick);

    // отрисовка с нуля
    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#container, this.#pointComponent, RenderPosition.BEFORE_END);
      return;
    }

    // перерисовка, если компонент уже существует
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }


  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }


  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#pointEditComponent.setDatePickers();

    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
  }

  #handleEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleCloseClick = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#changeData(point);
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleResetButtonClick = () => {
    remove(this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.#replaceFormToPoint();
      this.#pointEditComponent.reset(this.#point);
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }
}
