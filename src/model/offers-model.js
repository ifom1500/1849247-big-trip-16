export default class OffersModel {
  #offers = new Map();

  set = (allOffers) => {
    allOffers.forEach(({ type, offers }) => {
      this.#offers.set(type, offers);
    });
  }

  getByType = () => this.#offers; // {'bus' => Array( id, title, price ), ...}
}
