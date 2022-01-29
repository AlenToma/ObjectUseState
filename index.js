import { useState, useRef, useEffect } from 'react';
class StateContext {
  constructor(item, trigger) {
    for (let key in item) {
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

const CreateContext =(item) => {
  var sItem = useRef();
  const timer = useRef();

  if (item.__isInitialized === undefined) item.__isInitialized = false;
  const getItem = (tItem) => {
    sItem.current = new StateContext(tItem, (v) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setTItem(getItem(v));
      }, 10);
    });

    if (sItem.current.__isInitialized === undefined)
      sItem.current.__isInitialized = false;

    if (sItem.current.setValue === undefined)
      sItem.current.setValue = (v) => {
        setTItem(getItem({ ...tItem, ...v }));
      };
    return sItem.current;
  };
  const [tItem, setTItem] = useState(getItem(item));
  useEffect(() => {
    setTimeout(() => (tItem.__isInitialized = true), 100);

    return ()=> tItem.__isInitialized = false;
  }, []);
  return tItem;
};

module.exports =CreateContext;  
