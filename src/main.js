import TripPresenter from './presenter/trip-presenter.js';
import { destinations, tripPoints, POINT_COUNT } from './mock/trip-point.js';

const headerElement = document.querySelector('.page-header'); // ok
const mainElement = document.querySelector('.page-main'); // ok

const tripPresenter = new TripPresenter(headerElement, mainElement);

tripPresenter.init(tripPoints, destinations, POINT_COUNT);
