const { URLBuilder } = require('../utilities');

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
