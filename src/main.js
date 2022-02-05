import GeneralPresenter from './presenter/general-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import StatsPresenter from './presenter/stats-presenter.js';

import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';

import NavigationView from './view/navigation-view.js';

import ApiService from './api-service.js';

import { NavigationItem } from './utils/const.js';
import { render, RenderPosition } from './utils/render.js';

const END_POINT = 'https://16.ecmascript.pages.academy/big-trip/';
const AUTHORIZATION = 'Basic kd93h2owoc9123q';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const pageContainer = mainElement.querySelector('.page-body__container');

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const destinationsModel = new DestinationsModel(apiService);
const offersModel = new OffersModel(apiService);
const filterModel = new FilterModel();
const pointsModel = new PointsModel(apiService);

const filterPresenter = new FilterPresenter(headerElement.querySelector('.trip-controls'), filterModel);
const generalPresenter = new GeneralPresenter(
  headerElement,
  mainElement,
  pointsModel,
  filterModel,
  destinationsModel,
  offersModel,
);

filterPresenter.init();
generalPresenter.init();

Promise.all([
  pointsModel.init(),
  destinationsModel.init(),
  offersModel.init(),
])
  .finally(() => {
    let statsPresenter = null;

    const navigationComponent = new NavigationView(NavigationItem.TABLE);
    render(headerElement.querySelector('.trip-controls__navigation'), navigationComponent, RenderPosition.BEFORE_END);

    const handleTabChange = (navigationItem) => {
      switch (navigationItem) {
        case NavigationItem.TABLE:
          statsPresenter.destroy();
          filterPresenter.init();
          generalPresenter.init();
          break;
        case NavigationItem.STATS:
          statsPresenter = new StatsPresenter(pageContainer, pointsModel);

          filterPresenter.destroy();
          generalPresenter.clear();
          statsPresenter.init();
          break;
      }
    };

    navigationComponent.setTabChangeHandler(handleTabChange);

    const addPointButtonElement = document.querySelector('.trip-main__event-add-btn');

    addPointButtonElement.addEventListener('click', (evt) => {
      evt.preventDefault();

      generalPresenter.setCancelAddPointHandler(() => {
        addPointButtonElement.disabled = false;
      });

      addPointButtonElement.disabled = true;
      if (statsPresenter !== null) {
        statsPresenter.destroy();
        statsPresenter = null;
      }

      navigationComponent.changeTab(NavigationItem.TABLE);
      filterPresenter.init();
      generalPresenter.createPoint();
    });
  });
