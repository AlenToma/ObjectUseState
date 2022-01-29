import * as React from 'react';
class StateContext {
  constructor(item, trigger, hierarkiTree) {
    let keys = Object.keys(item);
    const prototype = Object.getPrototypeOf(item);
    if (prototype !== undefined && prototype != null) {
      const ignoreKyes = Object.getOwnPropertyNames(Object.prototype);
      keys = [...keys, ...Object.getOwnPropertyNames(prototype)].filter(x => !ignoreKyes.includes(x));
    }

    for (let key of keys) {
      let val = item[key];
      if (
        hierarkiTree !== false && typeof val === 'object' &&
        !Array.isArray(val) &&
        val !== undefined &&
        val !== null &&
        typeof val !== 'string'
      ) {
        item[key] = val = new StateContext(val, () => trigger(item), hierarkiTree);
      }

      Object.defineProperty(this, key, {
        get: () => item[key],
        set: (value) => {
          if (
            hierarkiTree !== false && typeof val === 'object' &&
            !Array.isArray(val) &&
            val !== undefined &&
            val !== null &&
            typeof val !== 'string'
          ) {
            value = new StateContext(value, () => trigger(item), hierarkiTree);
          }
          item[key] = value;
          if (key !== '__isInitialized') trigger(item);
        },
        enumerable: true,
      });
    }
  }
}

const CreateContext = (item, hierarkiTree) => {
  var sItem = React.useRef();
  const timer = React.useRef();
  var trigger = React.useRef();
  const getItem = (tmItem) => {
    if (tmItem.__isInitialized === undefined) tmItem.__isInitialized = false;

      tmItem.__setValue = (v) => {
        trigger.current(getItem({ ...tmItem, ...v }));
      };

      tmItem.__toJson = (v) => {
        {
          var jsonItem = { ...tmItem };
          delete jsonItem.__setValue;
          delete jsonItem.__toJson;
          delete jsonItem.__isInitialized;
          return JSON.stringify(jsonItem);
        }
      };

    sItem.current = new StateContext(tmItem, (v) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        trigger.current(getItem(v));
      }, 10);
    }, hierarkiTree);

    return sItem.current;
  };
  const [tItem, setTItem] = React.useState(getItem(item));
  trigger.current = setTItem;
  React.useEffect(() => {
    setTimeout(() => (tItem.__isInitialized = true), 100);
    return () => (tItem.__isInitialized = false);
  }, []);
  return tItem;
};

module.exports = CreateContext;
