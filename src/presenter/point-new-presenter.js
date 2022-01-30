import FormCreateEditView from '../view/form-create-edit-view.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';

import { getBlankPoint } from '../utils/common.js';
import { parseDate } from '../utils/date.js';

const blankPoint = getBlankPoint(parseDate);

export default class PointNewPresenter {
  #pointListContainer = null;
  #changeData = null;
  #pointEditComponent = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor(pointListContainer, changeData, destinationsModel, offersModel) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;

    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = () => {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new FormCreateEditView(
      blankPoint,
      this.#destinationsModel.get(),
      this.#offersModel.getByType(),
      { isNew: true }
    );

    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
    this.#pointEditComponent.setChangeDestinationHandler(this.#handleChangeDestination);
    this.#pointEditComponent.setChangeTypeHandler(this.#handleChangeType);
    this.#pointEditComponent.setDatePickers();

    render(this.#pointListContainer, this.#pointEditComponent, RenderPosition.AFTER_BEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleChangeDestination = (newDestination) =>
    this.#destinationsModel.getByName(newDestination);

  #handleChangeType = (newType) =>
    this.#offersModel.getByType(newType);

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    this.destroy();
  }

  #handleDeleteClick = () => {
    this.destroy();
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
