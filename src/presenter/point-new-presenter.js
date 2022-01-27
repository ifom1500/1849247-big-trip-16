import FormCreateEditView from '../view/form-create-edit-view.js';
import {generatePoorId} from '../mock/trip-point.js';
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

    const destinationInfo = this.#destinationsModel.getDestination(DESTINATIONS[0]);
    const currentOffersOfType = this.#offersModel.getOffers(EVENT_TYPES[0]);

    this.#pointEditComponent = new FormCreateEditView(blankPoint, destinationInfo, currentOffersOfType);

    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
    this._editFormComponent.setChangeDestinationHandler(this.#handleChangeDestination);
    this._editFormComponent.setChangeTypeHandler(this.#handleChangeType);

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
    this.#destinationsModel.getDestination(newDestination);

  #handleChangeType = (newType) =>
    this.#offersModel.getOffers(newType);

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: generatePoorId(), ...point},
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
