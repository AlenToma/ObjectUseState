import * as React from 'react';
class StateContext {
  constructor(item, trigger, hierarkiTree, ignoreObjectKeyNames) {
    try {
      let keys = Object.keys(item);
      const prototype = Object.getPrototypeOf(item);
      if (prototype !== undefined && prototype != null) {
        const ignoreKyes = Object.getOwnPropertyNames(Object.prototype);
        keys = [...keys, ...Object.getOwnPropertyNames(prototype)].filter(x => !ignoreKyes.includes(x));
      }

      for (let k of keys) {
        let val = item[key];
        let key = k;
        if (
          hierarkiTree !== false && (ignoreObjectKeyNames == undefined || !ignoreObjectKeyNames.find(x => x === key)) && typeof val === 'object' &&
          !Array.isArray(val) &&
          val !== undefined &&
          val !== null &&
          typeof val !== 'string'
        ) {
          item[key] = val = new StateContext(val, () => trigger(item), hierarkiTree, ignoreObjectKeyNames);
        }

        Object.defineProperty(this, key, {
          get: () => item[key],
          set: (value) => {
            if (
              hierarkiTree !== false && (ignoreObjectKeyNames == undefined || !ignoreObjectKeyNames.find(x => x === key)) && typeof val === 'object' &&
              !Array.isArray(val) &&
              val !== undefined &&
              val !== null &&
              typeof val !== 'string'
            ) {
              value = new StateContext(value, () => trigger(item), hierarkiTree, ignoreObjectKeyNames);
            }
            item[key] = value;
            if (key !== '__isInitialized') trigger(item);
          },
          enumerable: true,
        });
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

const __session = new Map();

const CreateContext = (item, hierarkiTree, sessionKey, ignoreObjectKeyNames) => {
  var sItem = React.useRef();
  const timer = React.useRef();
  var trigger = React.useRef();
  const getItem = (tmItem) => {
    if (tmItem.__isInitialized === undefined) tmItem.__isInitialized = false;

    tmItem.__setValue = (v) => {
      trigger.current(getItem({ ...tmItem, ...v }));
    };

    if (tmItem.__toJson === undefined)
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
    }, hierarkiTree, ignoreObjectKeyNames);

    return sItem.current;
  };
  const startItem = sessionKey && __session.has(sessionKey) ? __session.get(sessionKey) : getItem(item);
  if (sessionKey)
    __session.set(sessionKey, startItem);
  const [tItem, setTItem] = React.useState(startItem);
  trigger.current = setTItem;
  React.useEffect(() => {
    setTimeout(() => (tItem.__isInitialized = true), 100);
    return () => {
      (tItem.__isInitialized = false);
      if (sessionKey)
        __session.delete(key);
    }
  }, []);
  return tItem;
};

module.exports = CreateContext;
