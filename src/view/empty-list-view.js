import AbstractView from './abstract-view.js';

const createEmptyListTemplate = () => (
  `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>

    <p class="trip-events__msg">Click New Event to create your first point</p>`

  /*
  * Значение отображаемого текста зависит от выбранного фильтра:
  * - Everthing – 'Click New Event to create your first point'
  * - Past — 'There are no past events now';
  * - Future — 'There are no future events now'.
  **/
);

export default class EmptyListView extends AbstractView {
  get template() {
    return createEmptyListTemplate();
  }
}
