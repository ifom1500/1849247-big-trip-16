import { RenderPosition, renderElement } from './render.js';
import { MenuView } from './view/menu-view.js';
import { FiltersView } from './view/filters-view.js';
import { SortingView } from './view/sorting-view.js';
import { FormEditView } from './view/form-edit-view.js';
import { FormCreateView } from './view/form-create-view.js';
import { TripPointView } from './view/trip-point-view.js';
import { EventListView } from './view/events-list-view.js';
import { NewEventButtonView } from './view/new-event-button-view.js';
import { TripEventsView } from './view/trip-events-view.js';

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
renderElement(tripMainElement, new NewEventButtonView().element, RenderPosition.BEFORE_END);
// renderTemplate(tripMainElement, createNewEventButtonTemplate(), RenderPosition.BEFORE_END);


// Меню
renderElement(navigationElement, new MenuView().element, RenderPosition.BEFORE_END);
// renderTemplate(navigationElement, createMenuTemplate(), RenderPosition.BEFORE_END);


// Фильтры
// TODO: разделить обертку и форму
renderElement(tripControlsElement, new FiltersView().element, RenderPosition.BEFORE_END);
// renderTemplate(tripControlsElement, createFiltersTemplate(), RenderPosition.BEFORE_END);


// MAIN
// Контейнер tripEvents
renderElement(mainContainerElement, new TripEventsView().element, RenderPosition.AFTER_BEGIN);
// renderTemplate(mainContainerElement, createTripEventsTemplate(), RenderPosition.AFTER_BEGIN);
const tripEventsElement = mainElement.querySelector('.trip-events');


// Сортировка
renderElement(tripEventsElement, new SortingView().element, RenderPosition.AFTER_BEGIN);
// renderTemplate(tripEventsElement, createSortingTemplate(), RenderPosition.AFTER_BEGIN);


// Контент
// Контейнер Список точек маршрута
renderElement(tripEventsElement, new EventListView().element, RenderPosition.BEFORE_END);
// renderTemplate(tripEventsElement, createEventsListTemplate(), RenderPosition.BEFORE_END);
const tripEventsListElement = mainElement.querySelector('.trip-events__list');


// Формы редактирования и создания точек
renderElement(tripEventsListElement, new FormEditView().element, RenderPosition.AFTER_BEGIN);
// renderTemplate(tripEventsListElement, createFormEditTemplate(tripPoints[0], destinations, allOffers), RenderPosition.AFTER_BEGIN);
renderElement(tripEventsListElement, new FormCreateView().element, RenderPosition.BEFORE_END);
// renderTemplate(tripEventsListElement, createFormCreateTemplate(tripPoints[0], destinations, allOffers), RenderPosition.BEFORE_END);


// Точки маршрута
for (let i = 0; i < POINT_COUNT; i++) {
  renderElement(tripEventsListElement, new TripPointView().element, RenderPosition.BEFOREEND);
  // renderTemplate(tripEventsListElement, createPointTemplate(tripPoints[i]), RenderPosition.BEFORE_END);
}


// Подписка на события
const eventGroupSelectElement = mainContainerElement.querySelector('.event__type-group');
const eventTypeButtonElement = mainContainerElement.querySelector('.event__type-btn');
const eventTypeButtonIconElement = eventTypeButtonElement.querySelector('.event__type-icon');

eventGroupSelectElement.addEventListener('change', (evt) => {
  eventTypeButtonIconElement.src = `img/icons/${evt.target.value}.png`;
});
