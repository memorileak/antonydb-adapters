class ObjUtil {
  path(arrayOfProps) {
    return function(obj) {
      try {
        let currentValue = obj;
        for (let i = 0; i < arrayOfProps.length; i += 1) {
          currentValue = currentValue[arrayOfProps[i]];
        }
        return currentValue;
      } catch (err) {
        return '';
      }
    }
  }
}

const objUtil = new ObjUtil();

module.exports = {objUtil};
