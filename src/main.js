import GeneralPresenter from './presenter/trip-presenter.js';
import { destinations, tripPoints, POINT_COUNT } from './mock/trip-point.js';

const headerElement = document.querySelector('.page-header'); // ok
const mainElement = document.querySelector('.page-main'); // ok

const generalPresenter = new GeneralPresenter(headerElement, mainElement);

generalPresenter.init(tripPoints, destinations, POINT_COUNT);
