import AbstractObservable from '../utils/abstract-observable.js';

export default class OffersModel extends AbstractObservable {
  #offers = null

  setOffers(allOffersMap) {
    this.#offers = allOffersMap;
  }

  getOffers(type) {
    return this.#offers.get(type);
  }
}
