import { createMenuTemplate } from './view/menu-view.js';
import { createFiltersTemplate } from './view/filters-view.js';
import { createSortingTemplate } from './view/sorting-view.js';
import { createFormEditTemplate } from './view/form-edit-view.js';
import { createFormCreateTemplate } from './view/form-create-view.js';
import { createPointTemplate } from './view/trip-point-view.js';
import { createEventsListTemplate } from './view/events-list-view.js'

const POINT_COUNT = 3;

const RenderPosition = {
  BEFORE_BEGIN: 'beforebegin',
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

// Render Function

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Menu, Filter, Sorting

const navigationElement = headerElement.querySelector('.trip-controls__navigation');
renderTemplate(navigationElement, createMenuTemplate(), RenderPosition.BEFORE_END);

const filtersAndButtonElement = headerElement.querySelector('.trip-controls');
renderTemplate(filtersAndButtonElement, createFiltersTemplate(), RenderPosition.BEFORE_END);

const tripEventsElement = mainElement.querySelector('.trip-events');
renderTemplate(tripEventsElement, createSortingTemplate(), RenderPosition.AFTER_BEGIN);

// Content

const eventsListTemplate = createEventsListTemplate();
console.log('111', eventsListTemplate); //?
renderTemplate(tripEventsElement, eventsListTemplate, RenderPosition.BEFORE_END);

renderTemplate(eventsListTemplate, createFormEditTemplate(), RenderPosition.AFTER_BEGIN);
renderTemplate(eventsListTemplate, createFormCreateTemplate(), RenderPosition.BEFORE_END);

for (let i = 0; i < POINT_COUNT; i++) {
  renderTemplate(eventsListTemplate, createPointTemplate(), RenderPosition.BEFORE_END);
}
