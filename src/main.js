import { RenderPosition, render } from './utils/render.js';

import MenuView from './view/menu-view.js';
import NewEventButtonView from './view/new-event-button-view.js';
import FiltersView from './view/filters-view.js';

import SortingView from './view/sorting-view.js';
import FormCreateEditView from './view/form-create-edit-view.js';
import TripPointView from './view/trip-point-view.js';
import EventsListView from './view/events-list-view.js';
import TripEventsView from './view/trip-events-view.js';
import EmptyListView from './view/empty-list-view.js';

import { isEscapeEvent } from './utils/common.js';
import { parseDate } from './utils/date.js';
import { destinations, tripPoints, AllOffersMap } from './mock/trip-point.js';

const POINT_COUNT = 3;

const headerElement = document.querySelector('.page-header');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripControlsElement = headerElement.querySelector('.trip-controls');
const navigationElement = headerElement.querySelector('.trip-controls__navigation');

const mainElement = document.querySelector('.page-main');
const mainContainerElement = mainElement.querySelector('.page-main__container');

// Default Settings для точки
// Набросок для дефолтных значений новой точки
// Оставил моковый массив destinations, чтобы увидеть отображаются ли картинки
const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: parseDate(),
  dateTo: parseDate(),
  destination: {
    description: 'Your description',
    name: 'Your destination',
    pictures: [
      {
        description: 'picture Racсoon 1',
        src: 'http://picsum.photos/248/152?r=1',
      },
      {
        description: 'picture Racсoon 2',
        src: 'http://picsum.photos/248/152?r=2',
      },
      {
        description: 'picture Racсoon 3',
        src: 'http://picsum.photos/248/152?r=3',
      },
      {
        description: 'picture Racсoon 4',
        src: 'http://picsum.photos/248/152?r=4',
      }
    ],
  },
  id: '0',
  isFavorite: false,
  type: 'bus',
  offers: [
    {type: 'bus', offers: [{ id: 1, title: 'Video guide', price: 100 }]}
  ],
};

const Mode = {
  CREATE_MODE: true,
  EDIT_MODE: false,
};

// РЕНДЕР (родитель, точка)
const renderPoint = (eventsListElement, point, renderPosition = RenderPosition.BEFORE_END, mode = Mode.EDIT_MODE) => {
  const pointComponent = new TripPointView(point);
  const pointEditComponent = new FormCreateEditView(point, destinations, AllOffersMap, mode);

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
  pointComponent.setClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.setEditClickHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.setFormSubmitHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  if (mode) {
    render(eventsListElement, pointEditComponent.element, renderPosition);
  } else {
    render(eventsListElement, pointComponent.element, renderPosition);
  }
};

// Создание компонентов
const tripEventsComponent = new TripEventsView();
const eventsListComponent = new EventsListView();

// HEADER ===============================================
// КНОПКА
const newEventButton = new NewEventButtonView();
render(tripMainElement, newEventButton.element, RenderPosition.BEFORE_END);

newEventButton.element.addEventListener('click', () => {
  renderPoint(eventsListComponent.element, DEFAULT_POINT, RenderPosition.AFTER_BEGIN, Mode.CREATE_MODE);
});

// Меню
render(navigationElement, new MenuView().element, RenderPosition.BEFORE_END);

// Фильтры
// TODO: разделить обертку и форму
render(tripControlsElement, new FiltersView().element, RenderPosition.BEFORE_END);


// MAIN ===============================================
// Контейнер tripEvents
if (tripPoints.length === 0) {
  render(mainContainerElement, new EmptyListView().element, RenderPosition.AFTER_BEGIN);
} else {
  render(mainContainerElement, tripEventsComponent.element, RenderPosition.AFTER_BEGIN);

  // Сортировка
  render(tripEventsComponent.element, new SortingView().element, RenderPosition.AFTER_BEGIN);

  // Контент
  // Контейнер Список точек маршрута
  render(tripEventsComponent.element, eventsListComponent.element, RenderPosition.BEFORE_END);

  // Точки маршрута
  for (let i = 0; i < POINT_COUNT; i++) {
    renderPoint(eventsListComponent.element, tripPoints[i]);
  }
}
