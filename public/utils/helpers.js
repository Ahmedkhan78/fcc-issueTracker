module.exports = {
  removeUndefinedAndEmptyStringValuesFromObj(obj) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === "" || obj[key] === undefined) {
        delete obj[key];
      }
    });
    return obj;
  },
};
