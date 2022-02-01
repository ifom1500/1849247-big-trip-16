import MenuView from '../view/menu-view.js';
import NewEventButtonView from '../view/new-event-button-view.js';
import FiltersContainerView from '../view/filters-container-view.js';
import TripEventsView from '../view/trip-events-view.js';
import EventsListView from '../view/events-list-view.js';
import SortingView from '../view/sorting-view.js';
import EmptyListView from '../view/empty-list-view.js';
import LoadingView from '../view/loading-view.js';

import PointPresenter from '../presenter/point-presenter.js';
import PointNewPresenter from '../presenter/point-new-presenter.js';

import { RenderPosition, render, remove } from '../utils/render.js';
import { SortType } from '../utils/common.js';
import { comparePointByDay, comparePointByDuration, comparePointByPrice } from '../utils/date.js';
import { UpdateType, UserAction, FilterType, State as FormaState } from '../utils/const.js';
import { filterTypeToPoint } from '../utils/filter.js';

export default class GeneralPresenter {
  #headerElement = null;
  #mainElement = null;
  #tripMainElement = null;
  #tripControlsElement = null;
  #navigationElement = null;
  #mainContainerElement = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #menuComponent = new MenuView();
  #newEventButtonComponent = new NewEventButtonView();
  #filtersContainerComponent = new FiltersContainerView();

  #tripEventsComponent = new TripEventsView();
  #eventsListComponent = new EventsListView();
  #loadingComponent = new LoadingView();
  #emptyListComponent = null;
  #sortingComponent = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;

  #currentSortType = SortType.DAY;
  #isLoading = true;

  #cancelAddPointCallback = null

  constructor(
    headerContainer,
    mainContainer,
    pointsModel,
    filterModel,
    destinationsModel,
    offersModel
  ) {
    this.#headerElement = headerContainer;
    this.#mainElement = mainContainer;

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filterModel.type;
    const points = this.#pointsModel.points;
    const filteredPoints = filterTypeToPoint[filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(comparePointByDay);
      case SortType.TIME:
        return filteredPoints.sort(comparePointByDuration);
      case SortType.PRICE:
        return filteredPoints.sort(comparePointByPrice);
    }

    return filteredPoints;
  }

  init = () => {
    this.#tripMainElement = this.#headerElement.querySelector('.trip-main');
    this.#tripControlsElement = this.#headerElement.querySelector('.trip-controls');
    this.#navigationElement = this.#headerElement.querySelector('.trip-controls__navigation');
    this.#mainContainerElement = this.#mainElement.querySelector('.page-main__container');

    this.#renderBoard();
  }

  setCancelAddPointHandler = (callback) => {
    this.#cancelAddPointCallback = callback;
  }

  #handleViewAction = async (
    actionType,
    updateType,
    update,
  ) => {

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setViewState(FormaState.SAVING);
        try {
          await this.#pointsModel.update(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setViewState(FormaState.ABORTING);
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.add(updateType, update);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setViewState(FormaState.SAVING);
        try {
          await this.#pointsModel.delete(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setViewState(FormaState.ABORTING);
        }
        break;
      case UserAction.CANCEL_ADD_POINT:
        this.#destroyNewPointPresenter();
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data, this.#destinationsModel.get(), this.#offersModel.getByType());
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderList();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#renderList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        break;
    }
  }

  #renderMenu = () => {
    render(this.#navigationElement, this.#menuComponent, RenderPosition.BEFORE_END);
  }

  #renderNewEventButton = () => {
    render(this.#tripMainElement, this.#newEventButtonComponent, RenderPosition.BEFORE_END);
  }

  #renderFiltersContainer = () => {
    render(this.#tripControlsElement, this.#filtersContainerComponent, RenderPosition.BEFORE_END);
  }

  #renderEmptyList = () => {
    if (this.#emptyListComponent !== null) {
      remove(this.#emptyListComponent);
    }

    this.#emptyListComponent = new EmptyListView(this.#filterModel.type);
    render(this.#mainContainerElement, this.#emptyListComponent, RenderPosition.AFTER_BEGIN);
  }

  #renderTripEvents = () => {
    if (this.#emptyListComponent !== null) {
      remove(this.#emptyListComponent);
      this.#renderEventsList();
    }

    render(this.#mainContainerElement, this.#tripEventsComponent, RenderPosition.AFTER_BEGIN);
  }

  #renderSorting = () => {
    this.#sortingComponent = new SortingView(this.#currentSortType);
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#tripEventsComponent, this.#sortingComponent, RenderPosition.AFTER_BEGIN);
  }

  #renderEventsList = () => {
    if (this.#tripEventsComponent.element.contains(this.#eventsListComponent.element)) {
      return;
    }

    render(this.#tripEventsComponent, this.#eventsListComponent, RenderPosition.BEFORE_END);
  }

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(
      this.#eventsListComponent,
      this.#handleViewAction,
      this.#handleModeChange
    );

    pointPresenter.init(
      point,
      this.#destinationsModel.get(),
      this.#offersModel.getByType(),
    );

    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderLoading = () => {
    render(this.#mainContainerElement, this.#loadingComponent, RenderPosition.AFTER_BEGIN);
  }

  createPoint = () => {
    this.#renderTripEvents();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());

    this.#pointNewPresenter = new PointNewPresenter(
      this.#eventsListComponent,
      this.#handleViewAction,
      this.#destinationsModel,
      this.#offersModel
    );

    this.#currentSortType = SortType.DAY;
    this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init();
  }

  #destroyNewPointPresenter = () => {
    if (this.#pointNewPresenter !== null) {
      this.#pointNewPresenter.destroy();
      this.#handleCancelAddPoint();

      if (this.points.length === 0) {
        this.#renderEmptyList();
      }
    }
  }

  #resetPresenterViews = () => {
    this.#destroyNewPointPresenter();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleCancelAddPoint = () => {
    if (this.#cancelAddPointCallback !== null) {
      this.#cancelAddPointCallback();
    }
  }

  #handleModeChange = () => {
    this.#resetPresenterViews();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  }

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#destroyNewPointPresenter();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#loadingComponent);

    remove(this.#sortingComponent);

    if (this.#emptyListComponent !== null) {
      remove(this.#emptyListComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard = () => {
    if (this._isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderMenu();
    this.#renderNewEventButton();
    this.#renderList();
  }

  #renderList = () => {
    if (this.points.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderTripEvents();
      this.#renderSorting();
      this.#renderEventsList();
      this.#renderPoints(this.points);
    }
  }
}
