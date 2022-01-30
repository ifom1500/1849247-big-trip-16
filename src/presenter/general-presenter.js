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
import { UpdateType, UserAction, FilterType, State } from '../utils/const.js';
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

  #tripEventsComponent = new TripEventsView(); // <section> - сортировка + список точек
  #eventsListComponent = new EventsListView(); // <ul> - список точек
  #loadingComponent = new LoadingView();
  #emptyListComponent = null;
  #sortingComponent = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;

  #currentSortType = SortType.DAY;
  #isLoading = true;

  // КОНСТРУКТОР --------

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

    this.#pointNewPresenter = new PointNewPresenter(
      this.#eventsListComponent,
      this.#handleViewAction,
      this.#destinationsModel,
      this.#offersModel
    );
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

  #handleViewAction = (
    actionType,
    updateType,
    update,
  ) => {

    // console.log(
    //   'handleViewAction',
    //   '\n actionType ->', actionType, // действие пользователя -> какой метод модели вызвать
    //   '\n updateType ->', updateType, // тип изменений -> что после нужно обновить
    //   '\n update ->', update // update - обновленные данные
    // );

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.update(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {

    // console.log(
    //   'handleModelEvent',
    //   '\n updateType ->', updateType,
    //   '\n data ->', data
    // );

    switch (updateType) {
      case UpdateType.PATCH: // обновить часть списка (смена описания)
        this.#pointPresenter.get(data.id).init(data); // вместо update - data
        break;
      case UpdateType.MINOR: // обновить список (задача в архив)
        this.#clearBoard();
        this.#renderList();
        break;
      case UpdateType.MAJOR: // обновить всю доску (переключение фильтра)
        this.#clearBoard();
        this.#renderList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  }

  #renderMenu = () => {
    render(this.#navigationElement, this.#menuComponent, RenderPosition.BEFORE_END);
  }

  #renderNewEventButton = () => {
    render(this.#tripMainElement, this.#newEventButtonComponent, RenderPosition.BEFORE_END);

    // this.#newEventButtonComponent.setButtonClickHandler(() => {
    //   this.#renderPoint();
    // });
  }

  #renderFiltersContainer = () => {
    render(this.#tripControlsElement, this.#filtersContainerComponent, RenderPosition.BEFORE_END);
  }

  #renderEmptyList = () => {
    this.#emptyListComponent = new EmptyListView(this.#filterModel.type);
    render(this.#mainContainerElement, this.#emptyListComponent, RenderPosition.AFTER_BEGIN);
  }

  #renderTripEvents = () => {
    render(this.#mainContainerElement, this.#tripEventsComponent, RenderPosition.AFTER_BEGIN);
  }

  #renderSorting = () => {
    this.#sortingComponent = new SortingView(this.#currentSortType);
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#tripEventsComponent, this.#sortingComponent, RenderPosition.AFTER_BEGIN);
  }

  #renderEventsList = () => {
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
      point, // {basePrice: 84, dateFrom: M, dateTo: M, destination: {...}, ...}
      this.#destinationsModel.get(), // [{description}, {name}, {pics}, ...]
      this.#offersModel.getByType(), // {'bus' => Array( id, title, price ), ...}
    );

    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderLoading = () => {
    render(this.#mainContainerElement, this.#loadingComponent, RenderPosition.AFTER_BEGIN);
  }

  createPoint = () => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init();
  }

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
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
    this.#pointNewPresenter.destroy();
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
