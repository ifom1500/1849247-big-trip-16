import { createMenuTemplate } from './view/menu-view.js';
import { createFiltersTemplate } from './view/filters-view.js';
import { createSortingTemplate } from './view/sorting-view.js';
import { createFormEditTemplate } from './view/form-edit-view.js';
import { createFormCreateTemplate } from './view/form-create-view.js';
import { createPointTemplate } from './view/trip-point-view.js';
import { createEventsListTemplate } from './view/events-list-view.js';
import { createNewEventButtonTemplate } from './view/new-event-button-view.js';
import { createTripEventsTemplate } from './view/trip-events-view.js';

import {} from './mock/trip-point.js';

const POINT_COUNT = 3;

const RenderPosition = {
  BEFORE_BEGIN: 'beforebegin',
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

const headerElement = document.querySelector('.page-header');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripControlsElement = headerElement.querySelector('.trip-controls');
const navigationElement = headerElement.querySelector('.trip-controls__navigation');

const mainElement = document.querySelector('.page-main');
const mainContainerElement = mainElement.querySelector('.page-main__container');

// Функция отрисовки
const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// HEADER
// Кнопка Новое событие
renderTemplate(tripMainElement, createNewEventButtonTemplate(), RenderPosition.BEFORE_END);

// Меню
renderTemplate(navigationElement, createMenuTemplate(), RenderPosition.BEFORE_END);

// Фильтры
// TODO: разделить обертку и форму
renderTemplate(tripControlsElement, createFiltersTemplate(), RenderPosition.BEFORE_END);


// MAIN
// Контейнер tripEvents
renderTemplate(mainContainerElement, createTripEventsTemplate(), RenderPosition.AFTER_BEGIN);
const tripEventsElement = mainElement.querySelector('.trip-events');

// Сортировка
renderTemplate(tripEventsElement, createSortingTemplate(), RenderPosition.AFTER_BEGIN);

// Контент
// Контейнер Список точек маршрута
renderTemplate(tripEventsElement, createEventsListTemplate(), RenderPosition.BEFORE_END);
const tripEventsListElement = mainElement.querySelector('.trip-events__list');

// Формы редактирования и создания точек
renderTemplate(tripEventsListElement, createFormEditTemplate(), RenderPosition.AFTER_BEGIN);
renderTemplate(tripEventsListElement, createFormCreateTemplate(), RenderPosition.BEFORE_END);

// Точки маршрута
for (let i = 0; i < POINT_COUNT; i++) {
  renderTemplate(tripEventsListElement, createPointTemplate(), RenderPosition.BEFORE_END);
}
