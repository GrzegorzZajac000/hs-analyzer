import HeliumAPI from '../api/HeliumAPI';

const updateHSData = (hsList, hsInfo, updateHSInfo) => {
  let minTime = new Date().setDate(new Date().getDate() - 7);
  minTime = new Date(minTime).setMinutes(0);
  minTime = new Date(minTime).setSeconds(0);
  minTime = new Date(minTime).setMilliseconds(0);

  let maxTime = new Date().setHours(new Date().getHours() + 1);
  maxTime = new Date(maxTime).setMinutes(0);
  maxTime = new Date(maxTime).setSeconds(0);
  maxTime = new Date(maxTime).setMilliseconds(0);

  const config = {
    min_time: new Date(minTime).toISOString(),
    max_time: new Date(maxTime).toISOString()
  };

  return hsList.map(hs => {
    console.log(hs);

    return HeliumAPI.getHotspotActivityAllData(hs.value, () => {}, config)
      .then(res => {
        console.log(res);
      });
  });
};

export default updateHSData;
