import dayjs from 'dayjs';

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

const generateDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  // return dayjs().add(daysGap, 'day').toDate();
};

// const day time - задать день и время начала маршрута
// ---- dayjs(1318781876406) или var d = new Date(2018, 8, 18)

// day + someTime hours and mins - 1 точка ---- dayjs(day).add(100, 'minute').toDate();
// day + someTime hours and mins - 2 точка

export const generatetripPoint = () => {
  const day =

  return {
    basePrice: null, // number - 1100
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: '',
    id: null, // 0
    isFavorite: false,
    offers: '', // 0-5 шт - объект {название, цена}
    type: '',
    // ["taxi", "bus", "train", "ship", "drive", "flight", "check-in", "sightseeing", "restaurant"]
    destinationInfo: {
      description: generateDescription(),
      photos: [],  // http://picsum.photos/248/152?r=случайное_число
    },
    isFuture: false,
    isPast: false,
  };
};
