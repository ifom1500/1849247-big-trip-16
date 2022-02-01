// import { destinations, tripPoints } from './mock/trip-point.js';
// import { allOffers } from './mock/trip-point.js';

import GeneralPresenter from './presenter/general-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';

import ApiService from './api-service.js';

const END_POINT = 'https://16.ecmascript.pages.academy/big-trip/';
const AUTHORIZATION = 'Basic kd93h2owoc92662q';

const apiService = new ApiService(END_POINT, AUTHORIZATION);

// МОДЕЛИ -----

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

    // ПРЕЗЕНТЕРЫ -----

    const headerElement = document.querySelector('.page-header');
    const mainElement = document.querySelector('.page-main');

    const filterPresenter = new FilterPresenter(headerElement.querySelector('.trip-controls'), filterModel);
    filterPresenter.init();

    const generalPresenter = new GeneralPresenter(
      headerElement, // TODO: желательно избавится
      mainElement,
      pointsModel,
      filterModel,
      destinationsModel,
      offersModel
    );

    generalPresenter.init();

    const addPointButton = document.querySelector('.trip-main__event-add-btn');

    // TODO: new point button
    // создать компонент 'NewPointButton'
    //  + метод добавления обработчика: NewPointButton.setCickHandler
    //  + метод добавления обработчика: NewPointButton.setDisabled (true/false) / enabled/disabled
    addPointButton.addEventListener('click', (evt) => {
      evt.preventDefault();

      generalPresenter.setCancelAddPointHandler(() => {
        // NewPointButton.setDisabled(false) | NewPointButton.enabled()
        addPointButton.disabled = false;
      })

      // NewPointButton.setDisabled(true) | NewPointButton.disabled()
      addPointButton.disabled = true;
      generalPresenter.createPoint();
    });
  });
