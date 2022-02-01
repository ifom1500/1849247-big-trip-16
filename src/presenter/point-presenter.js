import TripPointView from '../view/trip-point-view.js';
import FormCreateEditView from '../view/form-create-edit-view.js';
import { RenderPosition, render, replace, remove } from '../utils/render.js';
import { isEscapeEvent } from '../utils/common.js';
import { UserAction, UpdateType, State } from '../utils/const.js';

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

  constructor(container, changeData, changeMode) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, destinations, offers) => {

    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new TripPointView(this.#point);
    this.#pointEditComponent = new FormCreateEditView(this.#point, destinations, offers, { isNew: false });

    this.#pointComponent.setRollupButtonClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#pointEditComponent.setRollupButtonClickHandler(this.#handleCloseClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteButtonClickHandler(this.#handleDeleteButtonClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#container, this.#pointComponent, RenderPosition.BEFORE_END);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => this.#pointEditComponent.updateData({
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });

    switch (state) {
      case State.SAVING:
        this.#pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#pointComponent.shake(resetFormState);
        this.#pointEditComponent.shake(resetFormState);
        break;
    }
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
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
    // this.#pointEditComponent.removeDatePickers();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleCloseClick = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (update) => {
    this.#replaceFormToPoint();
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update,
    );
  }

  #handleDeleteButtonClick = () => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      this.#point,
    );
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }
}
