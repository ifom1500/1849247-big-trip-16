import { createMenuComponent } from './view/menu-view.js';
import { createFiltersComponent } from './view/filters-view.js';
import { createSortingComponent } from './view/sorting-view.js';
import { createFormEditComponent } from './view/form-edit-view.js';
import { createFormCreateComponent } from './view/form-create-view.js';
import { createPointComponent } from './view/trip-point-view.js';


const POINT_COUNT = 3;

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');


const renderComponent = (container, component, position) => {
  container.insertAdjacentHTML(position, component);
};

// Menu, Filter, Sorting

const navigationElement = headerElement.querySelector('.trip-controls__navigation');
renderComponent(navigationElement, createMenuComponent(), RenderPosition.BEFOREEND);

const filtersElement = headerElement.querySelector('.trip-controls__filters');
renderComponent(filtersElement, createFiltersComponent(), RenderPosition.BEFOREEND);

const eventsElement = mainElement.querySelector('.trip-events');
renderComponent(eventsElement, createSortingComponent(), RenderPosition.AFTERBEGIN);

// Content

const eventsListElement = document.createElement('ul');
eventsListElement.classList.add('trip-events__list');
eventsElement.append(eventsListElement);

renderComponent(eventsListElement, createFormEditComponent(), RenderPosition.AFTERBEGIN);
renderComponent(eventsListElement, createFormCreateComponent(), RenderPosition.BEFOREEND);

for (let i = 0; i < POINT_COUNT; i++) {
  renderComponent(eventsListElement, createPointComponent(), RenderPosition.BEFOREEND);
}
