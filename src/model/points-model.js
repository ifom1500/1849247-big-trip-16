import AbstractObservable from '../utils/abstract-observable.js';
import { UpdateType } from '../utils/const.js';

export default class PointsModel extends AbstractObservable {
  #apiService = null;
  #points = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get points() {
    return [...this.#points];
  }

  set points(points) {
    this.#points = [...points];
  }

  // ---------------------------

  init = async () => {
    try {
      const points = await this.#apiService.points;
      this.#points = points.map(this.#adaptToClient);
      // [ {id, basePrice, Date ...} .... ]

    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  update = async (updateType, update) => {
    const index = this.#points.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#apiService.updatePoint(this.#adaptToServer(update));
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t update point');
    }

    /* TODO: оптимизация
    this.#points = this.#points.slice();
    this.#points[index] = update;
    **/

    this._notify(updateType, update);
  }

  add = async (updateType, update) => {
    try {
      const response = await this.#apiService.addTripEvent(this.#adaptToServer(update));
      const newPoint = this.#adaptToClient(response);
      this.#points = [...this.#points, newPoint];

      this._notify(updateType, newPoint);

    } catch (err) {
      throw new Error('Can\'t add new point]');
    }
  }

  delete = async (updateType, update) => {
    const index = this.#points.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#apiService.delete(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType);

    } catch (err) {
      throw new Error('Can\'t delete this trip event');
    }

    /* TODO: оптимизация
    this.#points = this.#points.slice();
    this.#points.splice(...)
    разобраться array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
    **/

    // При удалении не нужно ?
    // this._notify(updateType, update);
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      // посмотерть как приходят да и нужно ли их парсить
      // point['date_from'] может быть так
      dateTo: new Date(point['date_to']),
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  #adaptToServer = (point) => {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : point.dateFrom,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : point.dateTo,
      // посмотерть как приходят да и нужно ли их парсить
      // 'date_from': tripEvent.dateFrom, может быть так
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.price;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
