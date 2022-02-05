import AbstractView from './abstract-view.js';
import { createChart } from '../utils/chart.js';

const BAR_HEIGHT = 55;

const createStatsItemTemplate = ({ id, height }) => (
  `<div class="statistics__item">
    <canvas class="statistics__chart" id="${id}" width="900" height=${height}></canvas>
  </div>`
);

const createStatsTemplate = (data) => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>
    ${data.map(createStatsItemTemplate).join('')}
  </section>`
);

export default class StatisticsView extends AbstractView {
  #ids = {};
  #charts = [];

  constructor(charts) {
    super();

    this.#charts = charts;

    this.#init();
  }

  get template() {
    const data = this.#charts.map(({ id, labels }) => ({
      id,
      height: labels.length * BAR_HEIGHT,
    }));

    return createStatsTemplate(data);
  }

  removeElement = () => {
    super.removeElement();

    Object.values(this.#ids).forEach((chart) => chart.destroy());
    this.#ids = {};
  }

  #init = () => {
    const element = this.element;

    this.#charts.forEach(({ id, ...options }) => {
      this.#ids[id] = createChart(element.querySelector(`#${id}`), options);
    });
  }
}
