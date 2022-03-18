const isCurrentHS = currentHS => {
  return !isNaN(currentHS) && parseInt(Number(currentHS)) === currentHS && !isNaN(parseInt(currentHS, 10));
};

export default isCurrentHS;
