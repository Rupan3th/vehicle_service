export const isNull = (obj) => {
  return (obj === undefined) || (obj === null);
}

export const isJSONObject = (obj) => {
  return ((typeof (obj) === 'object') &&
          (Object.prototype.toString.call(obj).toLowerCase() === '[object object]') &&
          (!obj.length));
}