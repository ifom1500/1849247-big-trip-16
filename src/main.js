import { RenderPosition, render, replace, remove } from './utils/render.js';

import MenuView from './view/menu-view.js';
import NewEventButtonView from './view/new-event-button-view.js';
import FiltersContainerView from './view/filters-container-view.js';
import FiltersView from './view/filters-view.js';
import SortingView from './view/sorting-view.js';
import FormCreateEditView from './view/form-create-edit-view.js';
import TripPointView from './view/trip-point-view.js';
import EventsListView from './view/events-list-view.js';
import TripEventsView from './view/trip-events-view.js';
import EmptyListView from './view/empty-list-view.js';

import { isEscapeEvent } from './utils/common.js';
import { FormMode } from './utils/constants.js';
import { destinations, tripPoints, allOffersMap, POINT_COUNT, DEFAULT_POINT_DRAFT_DATA } from './mock/trip-point.js';

const headerElement = document.querySelector('.page-header');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripControlsElement = headerElement.querySelector('.trip-controls');
const navigationElement = headerElement.querySelector('.trip-controls__navigation');

const mainElement = document.querySelector('.page-main');
const mainContainerElement = mainElement.querySelector('.page-main__container');

const renderPoint = (
  eventsListElement,
  point,
  renderPosition = RenderPosition.BEFORE_END,
  mode = FormMode.EDIT) => {

  const pointComponent = new TripPointView(point);
  const pointEditComponent = new FormCreateEditView(point, destinations, allOffersMap, mode);

  const replacePointToForm = () => {
    replace(pointEditComponent, pointComponent);
  };

  const replaceFormToPoint = () => {
    replace(pointComponent, pointEditComponent);
  };

  const escKeyDownHandler = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }
  };

  pointComponent.setRollupButtonClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', escKeyDownHandler);
  });

  pointEditComponent.setRollupButtonClickHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', escKeyDownHandler);
  });

  pointEditComponent.setFormSubmitHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', escKeyDownHandler);
  });

  pointEditComponent.setResetButtonClickHandler(() => {
    remove(pointEditComponent);
    document.removeEventListener('keydown', escKeyDownHandler);
  });

  if (mode) {
    render(eventsListElement, pointEditComponent, renderPosition);
  } else {
    render(eventsListElement, pointComponent, renderPosition);
  }
};

const renderButton = (eventsListElement) => {
  const newEventButton = new NewEventButtonView();
  render(tripMainElement, newEventButton, RenderPosition.BEFORE_END);

  newEventButton.setButtonClickHandler(() => {
    renderPoint(eventsListElement.element, DEFAULT_POINT_DRAFT_DATA, RenderPosition.AFTER_BEGIN, FormMode.CREATE);
  });
};

const renderFilters = () => {
  const filtersContainerComponent = new FiltersContainerView();
  render(tripControlsElement, filtersContainerComponent, RenderPosition.BEFORE_END);
  render(filtersContainerComponent, new FiltersView(), RenderPosition.BEFORE_END);
};

// Меню
render(navigationElement, new MenuView(), RenderPosition.BEFORE_END);

// Контейнер для фильтров и фильтры
renderFilters();

// <section> - сортировка + список точек
const tripEventsComponent = new TripEventsView();
// <ul> - список точек
const eventsListComponent = new EventsListView();

// Кнопка
renderButton(eventsListComponent);

if (tripPoints.length === 0) {
  // Заглушкаr
  render(mainContainerElement, new EmptyListView(), RenderPosition.AFTER_BEGIN);
} else {
  // Отрисовка
  // <section> - сортировка + список точек
  render(mainContainerElement, tripEventsComponent, RenderPosition.AFTER_BEGIN);

  // Cортировка
  render(tripEventsComponent, new SortingView(), RenderPosition.AFTER_BEGIN);
  // Cписок точек
  render(tripEventsComponent, eventsListComponent, RenderPosition.BEFORE_END);

  // Точка маршрута
  for (let i = 0; i < POINT_COUNT; i++) {
    renderPoint(eventsListComponent, tripPoints[i]);
  }
}
