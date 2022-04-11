const { URLBuilder } = require('../utilities');

const wait = ms => {
  return new Promise(resolve => { setTimeout(resolve, ms); });
};

const cursorData = (instance, path, loadingStateUpdate, config) => {
  let url = URLBuilder(`${instance.defaults.baseURL}${path}`, config);
  const data = [];

  return instance.get(url)
    .then(async res => {
      data.push(res.data.data);

      if (loadingStateUpdate && typeof loadingStateUpdate === 'function') {
        loadingStateUpdate(data.flat().length);
      }

      while (res.data.cursor) {
        url = URLBuilder(`${instance.defaults.baseURL}${path}?cursor=${res.data.cursor}`, config);
        await wait(1001);
        res = await instance.get(url);
        data.push(res.data.data);

        if (loadingStateUpdate && typeof loadingStateUpdate === 'function') {
          loadingStateUpdate(data.flat().length);
        }
      }

      return data.flat();
    });
};

export default cursorData;
