/**
 * shuffle item of array
 * @param array
 * @returns {*[]}
 */
export const shuffleArray = (array = []) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export const isArray = (any) => ({}).toString.call(any) === '[object Array]';
