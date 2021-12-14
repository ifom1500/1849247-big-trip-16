import { RenderPosition, render } from './render.js';

import MenuView from './view/menu-view.js';
import NewEventButtonView from './view/new-event-button-view.js';
import FiltersView from './view/filters-view.js';

import SortingView from './view/sorting-view.js';
import FormEditView from './view/form-edit-view.js';
// import FormCreateView from './view/form-create-view.js'; // пока не используем
import TripPointView from './view/trip-point-view.js';
import EventsListView from './view/events-list-view.js';
import TripEventsView from './view/trip-events-view.js';
import EmptyListView from './view/empty-list-view.js';

import { isEscapeEvent } from './utils/utils.js';
import { destinations, tripPoints, AllOffersMap } from './mock/trip-point.js';

const POINT_COUNT = 3;

const headerElement = document.querySelector('.page-header');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripControlsElement = headerElement.querySelector('.trip-controls');
const navigationElement = headerElement.querySelector('.trip-controls__navigation');

const mainElement = document.querySelector('.page-main');
const mainContainerElement = mainElement.querySelector('.page-main__container');

const renderPoint = (eventsListElement, point) => {
  const pointComponent = new TripPointView(point);
  const pointEditComponent = new FormEditView(point, destinations, AllOffersMap);

  // Замена точки на форму и обратно
  const replacePointToForm = () => {
    eventsListElement.replaceChild(pointEditComponent.element, pointComponent.element);
  };

  const replaceFormToPoint = () => {
    eventsListElement.replaceChild(pointComponent.element, pointEditComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  // Слушатели
  pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(eventsListElement, pointComponent.element, RenderPosition.BEFORE_END);
};

// HEADER ===============================================
// Кнопка Новое событие
render(tripMainElement, new NewEventButtonView().element, RenderPosition.BEFORE_END);

// Меню
render(navigationElement, new MenuView().element, RenderPosition.BEFORE_END);

// Фильтры
// TODO: разделить обертку и форму
render(tripControlsElement, new FiltersView().element, RenderPosition.BEFORE_END);


// MAIN ===============================================
// Контейнер tripEvents
const tripEventsComponent = new TripEventsView();

if (tripPoints.length === 0) {
  render(mainContainerElement, new EmptyListView().element, RenderPosition.AFTER_BEGIN);
} else {
  render(mainContainerElement, tripEventsComponent.element, RenderPosition.AFTER_BEGIN);

  // Сортировка
  render(tripEventsComponent.element, new SortingView().element, RenderPosition.AFTER_BEGIN);

  // Контент
  // Контейнер Список точек маршрута
  const eventsListComponent = new EventsListView();
  render(tripEventsComponent.element, eventsListComponent.element, RenderPosition.BEFORE_END);

  // Точки маршрута
  for (let i = 0; i < POINT_COUNT; i++) {
    renderPoint(eventsListComponent.element, tripPoints[i]);
  }
}
