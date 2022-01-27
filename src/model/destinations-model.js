import AbstractObservable from '../utils/abstract-observable.js';

export default class DestinationsModel extends AbstractObservable {
  #destinations = new Map();

  setDestinations(destinations) {
    destinations.forEach((destination) =>
      this.#destinations.set(destination.name, destination));
  }

  getDestination(name) {
    return this.#destinations.get(name);
  }
}
