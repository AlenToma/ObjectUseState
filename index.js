import * as React from 'react';
class StateContext {
  constructor(item, trigger) {
    let keys = Object.keys(item);
    const prototype = Object.getPrototypeOf(item);
    if (prototype !== undefined && prototype != null) {
      keys = [...keys,
        ...Object.getOwnPropertyNames(prototype)];
    }
    for (let key of keys) {
      if (key == "constructor")
        continue;
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
  let trigger = undefined;
  if (item.__isInitialized === undefined) item.__isInitialized = false; 
  const getItem = (tItem) => {
    sItem.current = new StateContext(tItem, (v) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        trigger(getItem(v));
      }, 10);
    });

    if (sItem.current.__isInitialized === undefined)
      sItem.current.__isInitialized = false;

    if (sItem.current.setValue === undefined)
      sItem.current.setValue = (v) => {
      trigger(getItem({
        ...tItem, ...v
      }));
    };
    return sItem.current;
  };
  const [tItem,
    setTItem] = React.useState(getItem(item));
    
    trigger = setTItem;
  React.useEffect(() => {
    setTimeout(() => (tItem.__isInitialized = true), 100);

    return ()=> tItem.__isInitialized = false;
  }, []);
  return tItem;
};

module.exports = CreateContext;