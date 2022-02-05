import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const createChartOptions = ({
  text = '',
  labels = [],
  data = [],
  formatter,
} = {}) => ({
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels,
    datasets: [{
      data,
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#ffffff',
      anchor: 'start',
      barThickness: 44,
      minBarLength: 50,
    }],
  },
  options: {
    responsive: false,
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: '#000000',
        anchor: 'end',
        align: 'start',
        ...formatter && { formatter },
      },
    },
    title: {
      display: true,
      text,
      fontColor: '#000000',
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#000000',
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});

export const createChart = (element, options) =>
  new Chart(element, createChartOptions(options));
