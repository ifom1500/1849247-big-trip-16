import GeneralPresenter from './presenter/general-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';

import { destinations, tripPoints } from './mock/trip-point.js';
import { allOffersMap } from './mock/trip-point.js';


const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(destinations);

const offersModel = new OffersModel();
offersModel.setOffers(allOffersMap);

const filterModel = new FilterModel();

const pointsModel = new PointsModel();
pointsModel.points = tripPoints;


// Presenter
const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const filterPresenter = new FilterPresenter(headerElement, filterModel, pointsModel);
const generalPresenter = new GeneralPresenter(
  headerElement,
  mainElement,
  pointsModel,
  filterModel,
  destinationsModel,
  offersModel
);

generalPresenter.init(/*tripPoints, destinations, allOffersMap**/);
filterPresenter.init(); // возможно надо поставить ДО generalPresenter


// new point button
document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  generalPresenter.createPoint();
});
