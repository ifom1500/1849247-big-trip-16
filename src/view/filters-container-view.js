import AbstractView from './abstract-view.js';

const createFiltersContainerTemplate = () => (
  `<div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
  </div>`
);

export default class FiltersContainerView extends AbstractView {

  get template() {
    return createFiltersContainerTemplate();
  }
}
