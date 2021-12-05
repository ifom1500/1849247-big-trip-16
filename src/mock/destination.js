const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateDestination = () => (
  {
    description: 'Racoon description',
    name: 'Racoon City',
    pictures: [
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 10)}`,
        description: 'picture Racoon 1'
      },
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 10)}`,
        description: 'picture Racoon 2'
      },
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 10)}`,
        description: 'picture Racoon 3'
      }
    ]
  }
);
