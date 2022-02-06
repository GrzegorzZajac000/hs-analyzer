const DateGenerator = (date, maxTime) => {
  const d = new Date(date);

  if (maxTime) {
    d.setDate(d.getDate() + 1);
  }

  const year = d.getUTCFullYear();

  let month = d.getUTCMonth() + 1;
  month = month.toString();
  month = month.length <= 1 ? `0${month}` : month;

  let day = d.getUTCDate();
  day = day.toString();
  day = day.length <= 1 ? `0${day}` : day;

  return `${year}-${month}-${day}T00:00:00-00:00`;
};

export default DateGenerator;
