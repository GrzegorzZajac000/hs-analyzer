import HeliumAPI from './HeliumAPI';

const GetAllData = (promise, loadingStateUpdate) => {
  const data = [];

  return promise
    .then(async res => {
      data.push(res.data);
      loadingStateUpdate(data.flat().length);

      while (res.cursor) {
        res = await HeliumAPI.getNextPage(res.cursor);
        res = res.data;
        data.push(res.data);
        loadingStateUpdate(data.flat().length);
      }

      return data.flat();
    });
};

export default GetAllData;
