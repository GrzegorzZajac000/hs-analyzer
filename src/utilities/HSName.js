const HSName = {
  toView: name => {
    return name.split('-').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
  },

  toAPI: name => {
    return name.toLowerCase().replace(/\s/g, '-');
  }
};

export default HSName;
