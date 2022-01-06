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
import { FormMode } from '../utils/constants.js';
import { DEFAULT_POINT_DRAFT_DATA } from '../mock/trip-point.js';
import { updateItem } from '../utils/common.js';


export default class TripPresenter {
  #headerElement = null;
  #mainElement = null;
  #tripMainElement = null;
  #tripControlsElement = null;
  #navigationElement = null;
  #mainContainerElement = null;

  #tripPoints = [];
  #destinations = [];
  #pointCount = null;

  #menuComponent = new MenuView();
  #newEventButtonComponent = new NewEventButtonView();
  #filtersContainerComponent = new FiltersContainerView();
  #filtersComponent = new FiltersView();

  #tripEventsComponent = new TripEventsView(); // <section> - сортировка + список точек
  #eventsListComponent = new EventsListView(); // <ul> - список точек
  #sortingComponent = new SortingView();
  #emptyListComponent = new EmptyListView();

  #pointPresenter = new Map();

  constructor(headerContainer, mainContainer) {
    this.#headerElement = headerContainer;
    this.#mainElement = mainContainer;
  }

  init(tripPoints, destinations, POINT_COUNT) {
    this.#tripMainElement = this.#headerElement.querySelector('.trip-main');
    this.#tripControlsElement = this.#headerElement.querySelector('.trip-controls');
    this.#navigationElement = this.#headerElement.querySelector('.trip-controls__navigation');
    this.#mainContainerElement = this.#mainElement.querySelector('.page-main__container');

    this.#tripPoints = [...tripPoints];
    this.#destinations = [...destinations];
    this.#pointCount = POINT_COUNT;

    this.#renderSite(this.#tripPoints);
  }

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  #renderSite = () => {
    this.#renderMenu();
    this.#renderNewEventButton();
    this.#renderFiltersContainer();
    this.#renderFilters();

    if (this.#tripPoints.length === 0) {
      // Заглушка
      this.#renderEmptyList();
    } else {
      // <section> - сортировка + список точек
      this.#renderTripEvents();

      // Cортировка
      this.#renderSorting();
      // Cписок точек
      this.#renderEventsList();

      // Точка маршрута
      this.#renderPoints(this.#tripPoints);
    }
  }

  #renderMenu = () => {
    render(this.#navigationElement, this.#menuComponent, RenderPosition.BEFORE_END);
  }

  #renderNewEventButton = () => {
    render(this.#tripMainElement, this.#newEventButtonComponent, RenderPosition.BEFORE_END);

    this.#newEventButtonComponent.setButtonClickHandler(() => {
      this.#renderPoint(this.#eventsListComponent.element, DEFAULT_POINT_DRAFT_DATA, RenderPosition.AFTER_BEGIN, FormMode.CREATE);
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

  #renderEventsList = () => {
    render(this.#tripEventsComponent, this.#eventsListComponent, RenderPosition.BEFORE_END);
  }

  #renderSorting = () => {
    render(this.#tripEventsComponent, this.#sortingComponent, RenderPosition.AFTER_BEGIN);
  }

  #renderPoint = (
    eventsListElement,
    point,
    renderPosition = RenderPosition.BEFORE_END,
    mode = FormMode.EDIT
  ) => {
    const pointPresenter = new PointPresenter(eventsListElement);
    pointPresenter.init(point, renderPosition, mode, this.#destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderPoints = () => {
    for (let i = 0; i < this.#pointCount; i++) {
      this.#renderPoint(this.#eventsListComponent, this.#tripPoints[i]);
    }
  }
}
