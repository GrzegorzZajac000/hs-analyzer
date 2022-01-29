const URLBuilder = (url, obj) => {
  const rURL = new URL(url);
  Object.keys(obj).map(key => obj[key] ? rURL.searchParams.append(key, obj[key]) : null);
  return rURL.toString();
};

export default URLBuilder;
