import GeneralPresenter from './presenter/general-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';

import { destinations, tripPoints } from './mock/trip-point.js';
import { allOffers } from './mock/trip-point.js';


// МОДЕЛИ -----

const destinationsModel = new DestinationsModel();
destinationsModel.set(destinations);

const offersModel = new OffersModel();
offersModel.set(allOffers);

const filterModel = new FilterModel();

const pointsModel = new PointsModel();
pointsModel.points = tripPoints;

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');


// ПРЕЗЕНТЕРЫ -----

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

// TODO: new point button
// создать компонент 'NewPointButton'
//  + метод добавления обработчика: NewPointButton.setCickHandler
document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  generalPresenter.createPoint();
});
