import * as React from 'react';
class StateContext {
  constructor(item, trigger) {
    let keys = Object.keys(item);
    const prototype = Object.getPrototypeOf(item);
    if (prototype !== undefined && prototype != null) {
      keys = [...keys, ...Object.getOwnPropertyNames(prototype)];
    }
    for (let key of keys) {
      if (key == 'constructor') continue;
      let val = item[key];
      if (
        typeof val === 'object' &&
        !Array.isArray(val) &&
        val !== undefined &&
        val !== null &&
        typeof val !== 'string'
      ) {
        item[key] = val = new StateContext(val, () => trigger(item));
      }

      Object.defineProperty(this, key, {
        get: () => item[key],
        set: (value) => {
          if (
            typeof val === 'object' &&
            !Array.isArray(val) &&
            val !== undefined &&
            val !== null &&
            typeof val !== 'string'
          ) {
            value = new StateContext(value, () => trigger(item));
          }
          item[key] = value;
          if (key !== '__isInitialized') trigger(item);
        },
        enumerable: true,
      });
    }
  }
}

const CreateContext = (item) => {
  var sItem = React.useRef();
  const timer = React.useRef();
  var trigger = undefined;
  const getItem = (tItem) => {
    if (tItem.__isInitialized === undefined) tItem.__isInitialized = false;

    if (tItem.__setValue === undefined)
      tItem.__setValue = (v) => {
        trigger(getItem({ ...tItem, ...v }));
      };

    if (tItem.__toJson === undefined)
      tItem.__toJson = (v) => {
        {
          var jsonItem = { ...tItem };
          delete jsonItem.__setValue;
          delete jsonItem.__toJson;
          delete jsonItem.__isInitialized;
          return JSON.stringify(jsonItem);
        }
      };

    sItem.current = new StateContext(tItem, (v) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        trigger(getItem(v));
      }, 10);
    });

    return sItem.current;
  };
  const [tItem, setTItem] = React.useState(getItem(item));
  trigger = setTItem;
  React.useEffect(() => {
    setTimeout(() => (tItem.__isInitialized = true), 100);
    return () => (tItem.__isInitialized = false);
  }, []);
  return tItem;
};

module.exports = CreateContext;
