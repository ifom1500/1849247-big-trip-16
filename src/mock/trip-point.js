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

const timeStart = generateDate();
console.log('111', timeStart);
const timeEnd = timeStart + getRandomInteger();
console.log('222', timeEnd);


// export const generatetripPoint = () => {
//   const timeStart = generateDate();
//   const timeEnd = timeStart + getRandomInteger();

//   return {
//     type: '', // 1 from -> Taxi, Bus, Train, Ship, Drive, Flight, Check-in, Sightseeing, Restaurant
//     destination: '', // 1 from -> Санкт-Петербург, Екатеринбург, Новосибирск, Северодвинск, Байкал, Куриллы
//     timeStart,
//     timeEnd,
//     price: '',
//     offers: '', // 0-5 шт - объект {название, цена}
//     destinationInfo: {
//       description: generateDescription(),
//       photos: [],  // http://picsum.photos/248/152?r=случайное_число
//     },
//     isFavorite: false,
//     isFuture: false,
//     isPast: false,
//   };
// };
