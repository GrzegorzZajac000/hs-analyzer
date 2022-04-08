const generateDateConfig = (dM, min, max) => {
  let minTime, maxTime;

  if (dM !== 'custom') {
    const dateMode = parseInt(dM);

    minTime = new Date().setDate(new Date().getDate() - dateMode + 1);
    maxTime = new Date().setHours(new Date().getHours() + 1);
  } else {
    minTime = new Date(min).setMinutes(0);
    maxTime = new Date(max).setHours(new Date(max).getHours() + 1);
  }

  minTime = new Date(minTime).setMinutes(0);
  minTime = new Date(minTime).setSeconds(0);
  minTime = new Date(minTime).setMilliseconds(0);

  maxTime = new Date(maxTime).setMinutes(0);
  maxTime = new Date(maxTime).setSeconds(0);
  maxTime = new Date(maxTime).setMilliseconds(0);

  return {
    min_time: new Date(minTime).toISOString(),
    max_time: new Date(maxTime).toISOString()
  };
}

export default generateDateConfig;
