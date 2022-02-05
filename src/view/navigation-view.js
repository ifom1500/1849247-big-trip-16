import SmartView from './smart-view.js';

import { NavigationItem } from '../utils/const.js';
import { capitalize } from '../utils/common.js';

const NAVIGATION_ACTIVE_CLASS = 'trip-tabs__btn--active';

const createNavigationItemTemplate = (tab, isChecked = false) => (
  `<a
    href="#"
    class="trip-tabs__btn ${isChecked ? NAVIGATION_ACTIVE_CLASS : ''}"
    data-name="${tab}"
  >${capitalize(tab)}</a>`
);

const createNavigationTemplate = ({ activeTab, tabs }) => (
  `<nav class="trip-controls__trip-tabs trip-tabs">
    ${tabs.map((tab) => createNavigationItemTemplate(tab, tab === activeTab)).join('')}
  </nav>`
);

export default class NavigationView extends SmartView {
  constructor(activeTab) {
    super();

    this._data = {
      activeTab,
      tabs: Object.values(NavigationItem),
    };
  }

  get template() {
    return createNavigationTemplate(this._data);
  }

  setTabChangeHandler = (callback) => {
    this._callback.changeTab = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  changeTab = (tab) => {
    this.updateData({ activeTab: tab }, false);
  }

  restoreHandlers = () => {
    this.setTabChangeHandler(this._callback.changeTab);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.nodeName !== 'A')  {
      return;
    }

    const name = evt.target.dataset.name;
    if (this._data.activeTab === name) {
      return;
    }

    this.updateData({ activeTab: name }, false);
    this._callback.changeTab(name);
  }
}
