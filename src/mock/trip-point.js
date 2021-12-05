import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';

dayjs.extend(objectSupport);

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateDescription = () => {
  const fullText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  const descriptons = fullText.split('. ');
  const randomIndex = getRandomInteger(0, descriptons.length - 1);

  return descriptons[randomIndex];
};

const startDay = dayjs({
  year: getRandomInteger(2022, 2024),
  month: getRandomInteger(0, 11),
  day: getRandomInteger(1, 30),
  hour: getRandomInteger(0, 24),
  minute: getRandomInteger(0, 60),
});

const createTimePoints = (count) => {
  let points = [startDay];

  for (let i = 0; i < count; i++) {
    const nextTimePoint = points[i].add(getRandomInteger(5, 60), 'minute');
    points = [...points, nextTimePoint];
  }

  return points;
};

const createCounter = () => {
  let i = 0;
  return () => i++;
};

const counter = createCounter();

const generateTripPoint = (timePointsArray) => (
  {
    basePrice: getRandomInteger(20, 200),
    dateFrom: `${timePointsArray[counter()].toJSON()}`,
    dateTo: `${timePointsArray[counter() + 1].toJSON()}`,
    // выражение counter() + 1 выполнено для быстрого построения цепочки времен
    // когда время завершения предыдущего пункта является временем начала следующего
    // это не верно с точки зрения что я перепрыгиваю через элемент массива, а не беру по порядку
    // но так как это моки, то оставляю так. Данный поясняющий комментарий удалю позже.
    destination: 'Hogwarts School',
    id: '0',
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: [
      {
        type: 'taxi',
        offers: [
          {
            id: 1,
            title: 'Upgrade ',
            price: 1
          }, {
            id: 2,
            title: 'Choose the radio station',
            price: 60
          }
        ]
      },
      {
        type: 'flight',
        offers: [
          {
            id: 1,
            title: 'Upgrade to a business class',
            price: 120
          }, {
            id: 2,
            title: 'Choose the radio station',
            price: 60
          }
        ]
      }
    ],
    type: 'bus',
    destinationInfo: {
      description: generateDescription(),
      photos: [],  // http://picsum.photos/248/152?r=случайное_число
    },
    isFuture: Boolean(getRandomInteger(0, 1)),
    isPast: Boolean(getRandomInteger(0, 1)),
  }
);

export { createTimePoints, generateTripPoint };
