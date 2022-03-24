import { dateUtility } from './index';

const generateLabels = (minTime, maxTime) => {
  return new Promise(resolve => {
    const labels = [];
    const currentDate = new Date(minTime);
    const endDate = new Date(maxTime);

    while (currentDate <= endDate) { // eslint-disable-line no-unmodified-loop-condition
      labels.push(dateUtility(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return resolve(labels);
  });
};

export default generateLabels;
