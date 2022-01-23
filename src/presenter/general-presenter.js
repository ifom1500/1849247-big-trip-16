import MenuView from '../view/menu-view.js';
import NewEventButtonView from '../view/new-event-button-view.js';
import FiltersContainerView from '../view/filters-container-view.js';
import FiltersView from '../view/filters-view.js';
import TripEventsView from '../view/trip-events-view.js';
import EventsListView from '../view/events-list-view.js';
import SortingView from '../view/sorting-view.js';
import EmptyListView from '../view/empty-list-view.js';

import PointPresenter from '../presenter/point-presenter.js';

import { RenderPosition, render } from '../utils/render.js';
import { SortType, updateItem, getBlankPoint } from '../utils/common.js';
import { parseDate } from '../utils/date.js';
import { comparePointByDay, comparePointByDuration, comparePointByPrice } from '../utils/date.js';

const BLANK_POINT = getBlankPoint(parseDate);

export default class GeneralPresenter {
  #headerElement = null;
  #mainElement = null;
  #tripMainElement = null;
  #tripControlsElement = null;
  #navigationElement = null;
  #mainContainerElement = null;

  #tripPoints = [];
  #destinations = [];
  #sourcedTripPoints = [];
  #allOffersMap = [];

  #menuComponent = new MenuView();
  #newEventButtonComponent = new NewEventButtonView();
  #filtersContainerComponent = new FiltersContainerView();
  #filtersComponent = new FiltersView();

  #tripEventsComponent = new TripEventsView(); // <section> - сортировка + список точек
  #eventsListComponent = new EventsListView(); // <ul> - список точек
  #sortingComponent = new SortingView();
  #emptyListComponent = new EmptyListView();

  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor(headerContainer, mainContainer) {
    this.#headerElement = headerContainer;
    this.#mainElement = mainContainer;
  }

  init(tripPoints, destinations, allOffersMap) {
    this.#tripMainElement = this.#headerElement.querySelector('.trip-main');
    this.#tripControlsElement = this.#headerElement.querySelector('.trip-controls');
    this.#navigationElement = this.#headerElement.querySelector('.trip-controls__navigation');
    this.#mainContainerElement = this.#mainElement.querySelector('.page-main__container');

    const sortedPoints = [...tripPoints].sort(comparePointByDay);
    this.#destinations = [...destinations];

    this.#tripPoints = sortedPoints;
    this.#sourcedTripPoints = [...sortedPoints];
    this.#allOffersMap = allOffersMap;

    this.#renderSite();
  }

  #renderSite = () => {
    this.#renderMenu();
    this.#renderNewEventButton();
    this.#renderFiltersContainer();
    this.#renderFilters();

    if (this.#tripPoints.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderTripEvents();
      this.#renderSorting();
      this.#renderEventsList();
      this.#renderPoints(this.#tripPoints);
    }
  }

  #renderMenu = () => {
    render(this.#navigationElement, this.#menuComponent, RenderPosition.BEFORE_END);
  }

  #renderNewEventButton = () => {
    render(this.#tripMainElement, this.#newEventButtonComponent, RenderPosition.BEFORE_END);

    this.#newEventButtonComponent.setButtonClickHandler(() => {
      this.#renderPoint(BLANK_POINT);
    });
  }

  #renderFiltersContainer = () => {
    render(this.#tripControlsElement, this.#filtersContainerComponent, RenderPosition.BEFORE_END);
  }

  #renderFilters = () => {
    render(this.#filtersContainerComponent, this.#filtersComponent, RenderPosition.BEFORE_END);
  }

  #renderEmptyList = () => {
    render(this.#mainContainerElement, this.#emptyListComponent, RenderPosition.AFTER_BEGIN);
  }

  #renderTripEvents = () => {
    render(this.#mainContainerElement, this.#tripEventsComponent, RenderPosition.AFTER_BEGIN);
  }

  #renderSorting = () => {
    render(this.#tripEventsComponent, this.#sortingComponent, RenderPosition.AFTER_BEGIN);

    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderEventsList = () => {
    render(this.#tripEventsComponent, this.#eventsListComponent, RenderPosition.BEFORE_END);
  }

  #renderPoints = () => {
    this.#tripPoints.forEach((point) => this.#renderPoint(point));
  }


  // ОТРИСОВКА ОДНОЙ ТОЧКИ

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#eventsListComponent, this.#handlePointChange, this.#handleModeChange, this.#allOffersMap);
    pointPresenter.init(point, this.#destinations);

    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }


  // СОРТИРОВКА

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        this.#tripPoints.sort(comparePointByDay);
        break;
      case SortType.TIME:
        this.#tripPoints.sort(comparePointByDuration);
        break;
      case SortType.PRICE:
        this.#tripPoints.sort(comparePointByPrice);
        break;
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPoints();
  }


  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#sourcedTripPoints = updateItem(this.#sourcedTripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#destinations);
  }
}
