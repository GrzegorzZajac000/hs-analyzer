import { DateTime } from 'luxon';

const GetTimeAgo = (datePast) => {
  const units = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];
  const dateTime = DateTime.fromMillis(datePast)
  const diff = dateTime.diffNow().shiftTo(...units);
  const unit = units.find((unit) => diff.get(unit) !== 0) || 'second';
  const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit);
};

export default GetTimeAgo;
