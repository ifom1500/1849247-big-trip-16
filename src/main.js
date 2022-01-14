import GeneralPresenter from './presenter/general-presenter.js';
import { destinations, tripPoints } from './mock/trip-point.js';
import { allOffersMap } from './mock/trip-point.js';

const headerElement = document.querySelector('.page-header'); // ok
const mainElement = document.querySelector('.page-main'); // ok

const generalPresenter = new GeneralPresenter(headerElement, mainElement, allOffersMap);

generalPresenter.init(tripPoints, destinations);
