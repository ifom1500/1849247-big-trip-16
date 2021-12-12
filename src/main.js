import { RenderPosition, render } from './render.js';

import MenuView from './view/menu-view.js';
import NewEventButtonView from './view/new-event-button-view.js';
import FiltersView from './view/filters-view.js';

import SortingView from './view/sorting-view.js';
import FormEditView from './view/form-edit-view.js';
import FormCreateView from './view/form-create-view.js';
import TripPointView from './view/trip-point-view.js';
import EventListView from './view/events-list-view.js';

import TripEventsView from './view/trip-events-view.js';

import { destinations, tripPoints, allOffers } from './mock/trip-point.js';

const POINT_COUNT = 3;

const headerElement = document.querySelector('.page-header');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripControlsElement = headerElement.querySelector('.trip-controls');
const navigationElement = headerElement.querySelector('.trip-controls__navigation');

const mainElement = document.querySelector('.page-main');
const mainContainerElement = mainElement.querySelector('.page-main__container');


// HEADER
// Кнопка Новое событие
render(tripMainElement, new NewEventButtonView().element, RenderPosition.BEFORE_END);


// Меню
render(navigationElement, new MenuView().element, RenderPosition.BEFORE_END);

// Фильтры
// TODO: разделить обертку и форму
render(tripControlsElement, new FiltersView().element, RenderPosition.BEFORE_END);


// MAIN ===============================================
// Контейнер tripEvents
const TripEventsComponent = new TripEventsView();
render(mainContainerElement, TripEventsComponent.element, RenderPosition.AFTER_BEGIN);

// Сортировка
render(TripEventsComponent.element, new SortingView().element, RenderPosition.AFTER_BEGIN);


// Контент
// Контейнер Список точек маршрута
const EventListComponent = new EventListView();
render(TripEventsComponent.element, EventListComponent.element, RenderPosition.BEFORE_END);


// Формы редактирования и создания точек
render(EventListComponent.element, new FormEditView(tripPoints[0], destinations, allOffers).element, RenderPosition.AFTER_BEGIN);
render(EventListComponent.element, new FormCreateView(tripPoints[0], destinations, allOffers).element, RenderPosition.BEFORE_END);


// Точки маршрута
for (let i = 0; i < POINT_COUNT; i++) {
  render(EventListComponent.element, new TripPointView(tripPoints[i]).element, RenderPosition.BEFORE_END);
}


// Подписка на события
const eventGroupSelectElement = mainContainerElement.querySelector('.event__type-group');
const eventTypeButtonElement = mainContainerElement.querySelector('.event__type-btn');
const eventTypeButtonIconElement = eventTypeButtonElement.querySelector('.event__type-icon');

eventGroupSelectElement.addEventListener('change', (evt) => {
  eventTypeButtonIconElement.src = `img/icons/${evt.target.value}.png`;
});
