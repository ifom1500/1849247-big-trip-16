import { RenderPosition, render } from './render.js';

import MenuView from './view/menu-view.js';
import NewEventButtonView from './view/new-event-button-view.js';
import FiltersView from './view/filters-view.js';

import SortingView from './view/sorting-view.js';
import FormEditView from './view/form-edit-view.js';
// import FormCreateView from './view/form-create-view.js'; // пока не используем
import TripPointView from './view/trip-point-view.js';
import EventListView from './view/events-list-view.js';
import TripEventsView from './view/trip-events-view.js';
import EmptyListView from './view/empty-list-view.js';

import { destinations, tripPoints, allOffers } from './mock/trip-point.js';

const POINT_COUNT = 3;

const headerElement = document.querySelector('.page-header');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripControlsElement = headerElement.querySelector('.trip-controls');
const navigationElement = headerElement.querySelector('.trip-controls__navigation');

const mainElement = document.querySelector('.page-main');
const mainContainerElement = mainElement.querySelector('.page-main__container');

const renderPoint = (eventListElement, point) => {
  const pointComponent = new TripPointView(point);
  const pointEditComponent = new FormEditView(point, destinations, allOffers);

  // Замена точки на форму и обратно
  const replacePointToForm = () => {
    eventListElement.replaceChild(pointEditComponent.element, pointComponent.element);

    // Смена значка типа точки путешествия
    const typeGroupElement = mainContainerElement.querySelector('.event__type-group');
    const typeButtonElement = mainContainerElement.querySelector('.event__type-btn');
    const typeIconElement = typeButtonElement.querySelector('.event__type-icon');

    const onChangeTypeGroupElement = (evt) => {
      typeIconElement.src = `img/icons/${evt.target.value}.png`;
    };

    typeGroupElement.addEventListener('change', onChangeTypeGroupElement);
    // TODO: удалить слушатель при закрытии формы
  };

  const replaceFormToPoint = () => {
    eventListElement.replaceChild(pointComponent.element, pointEditComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
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
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.addEventListener('keydown', onEscKeyDown);
  });

  render(eventListElement, pointComponent.element, RenderPosition.BEFORE_END);
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
const TripEventsComponent = new TripEventsView();

if (tripPoints.length === 0) {
  render(mainContainerElement, new EmptyListView().element, RenderPosition.AFTER_BEGIN);
} else {
  render(mainContainerElement, TripEventsComponent.element, RenderPosition.AFTER_BEGIN);

  // Сортировка
  render(TripEventsComponent.element, new SortingView().element, RenderPosition.AFTER_BEGIN);

  // Контент
  // Контейнер Список точек маршрута
  const EventListComponent = new EventListView();
  render(TripEventsComponent.element, EventListComponent.element, RenderPosition.BEFORE_END);

  // Формы создания точек
  // render(EventListComponent.element, new FormCreateView(tripPoints[0], destinations, allOffers).element, RenderPosition.BEFORE_END);

  // Точки маршрута
  for (let i = 0; i < POINT_COUNT; i++) {
    renderPoint(EventListComponent.element, tripPoints[i]);
  }
}
