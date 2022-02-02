import FormCreateEditView from '../view/form-create-edit-view.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { UserAction, UpdateType } from '../utils/const.js';
import { getLocalPoint, isEscapeEvent } from '../utils/common.js';

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

    const localPoint = getLocalPoint();

    this.#pointEditComponent = new FormCreateEditView(
      localPoint,
      this.#destinationsModel.get(),
      this.#offersModel.getByType(),
      { isNew: true }
    );

    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setCancelClickHandler(this.#handleCancelClick);

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

  setSaving = () => {
    this.#pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    }, false);
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
      }, false);
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  #handleCancelClick = () => {
    this.destroy();

    this.#changeData(
      UserAction.CANCEL_ADD_POINT,
      UpdateType.NONE,
      null,
    );
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
