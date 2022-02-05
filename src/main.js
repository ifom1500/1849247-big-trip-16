import GeneralPresenter from './presenter/general-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';

import NavigationView from './view/navigation-view.js';
import StatisticsView from './view/statistics-view.js';

import ApiService from './api-service.js';

import { NavigationItem } from './utils/const.js';
import { remove, render, RenderPosition } from './utils/render.js';

const END_POINT = 'https://16.ecmascript.pages.academy/big-trip/';
const AUTHORIZATION = 'Basic kd93h2owoc92662q';

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const destinationsModel = new DestinationsModel(apiService);
const offersModel = new OffersModel(apiService);
const filterModel = new FilterModel();
const pointsModel = new PointsModel(apiService);

Promise.all([
  pointsModel.init(),
  destinationsModel.init(),
  offersModel.init(),
])
  .finally(() => {

    const headerElement = document.querySelector('.page-header');
    const mainElement = document.querySelector('.page-main');
    const pageContainer = mainElement.querySelector('.page-body__container');

    const navigationComponent = new NavigationView();
    let statisticsComponent = null;

    const filterPresenter = new FilterPresenter(headerElement.querySelector('.trip-controls'), filterModel);
    filterPresenter.init();
    const generalPresenter = new GeneralPresenter(
      headerElement,
      mainElement,
      pointsModel,
      filterModel,
      destinationsModel,
      offersModel,
    );

    const handleNavigationClick = (navigationItem) => {
      console.log('111');
      switch (navigationItem) {
        case NavigationItem.TABLE:
          remove(statisticsComponent);
          filterPresenter.init();
          generalPresenter.init();
          // newPointButtonComponent.enableButton();
          break;
        case NavigationItem.STATS:
          filterPresenter.destroy();
          generalPresenter.destroy();
          statisticsComponent = new StatisticsView(pointsModel.points);
          render(pageContainer, statisticsComponent, RenderPosition.BEFOREEND);
          break;
      }
    };

    navigationComponent.setNavigationClickHandler(handleNavigationClick);

    generalPresenter.init();

    const addPointButtonElement = document.querySelector('.trip-main__event-add-btn');

    addPointButtonElement.addEventListener('click', (evt) => {
      evt.preventDefault();

      generalPresenter.setCancelAddPointHandler(() => {
        addPointButtonElement.disabled = false;
      });

      addPointButtonElement.disabled = true;
      generalPresenter.createPoint();
    });
  });
