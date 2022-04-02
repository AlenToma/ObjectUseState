import * as React from 'react';
class StateContext {
  constructor(item, trigger, hierarkiTree, ignoreObjectKeyNames) {
    try {
      let keys = Object.keys(item);
      const prototype = Object.getPrototypeOf(item);
      if (prototype !== undefined && prototype != null) {
        const ignoreKyes = Object.getOwnPropertyNames(Object.prototype);
        keys = [...keys, ...Object.getOwnPropertyNames(prototype)].filter(
          (x) => !ignoreKyes.includes(x)
        );
      }

      for (let key of keys) {
        let val = item[key];
        if (
          hierarkiTree !== false &&
          (ignoreObjectKeyNames == undefined ||
            !ignoreObjectKeyNames.find((x) => x === key)) &&
          typeof val === 'object' &&
          !Array.isArray(val) &&
          val !== undefined &&
          val !== null &&
          typeof val !== 'string'
        ) {
          item[key] = val = new StateContext(
            val,
            () => trigger(item),
            hierarkiTree,
            ignoreObjectKeyNames
          );
        }

        Object.defineProperty(this, key, {
          get: () => item[key],
          set: (value) => {
            if (
              hierarkiTree !== false &&  (ignoreObjectKeyNames == undefined || !ignoreObjectKeyNames.find((x) => x === key)) && typeof value === 'object' && !Array.isArray(value) &&
              value !== undefined &&
              value !== null &&
              typeof value !== 'string'
            ) {
              value = new StateContext(
                value,
                () => trigger(item),
                hierarkiTree,
                ignoreObjectKeyNames
              );
            }
            item[key] = value;
            if (key !== '__isInitialized') {
              trigger(item);
            }
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

const CreateContext = (item, hierarkiTree, ignoreObjectKeyNames, keyTimeout) => {
  const sItem = React.useRef();
  const timer = React.useRef();
  const trigger = React.useRef();
  const mountedTimeout = React.useRef();
  keyTimeout = keyTimeout !== undefined ? keyTimeout : 10;
  const getItem = (tmItem) => {
    if (tmItem.__isInitialized === undefined) tmItem.__isInitialized = false;

    tmItem.__setValue = (v) => {
      trigger.current(getItem({ ...tmItem, ...v }));
    };

    tmItem.__toJson = (v) => {
      {
        return JSON.stringify(tmItem.__cleanItem());
      }
    };

    tmItem.__cleanItem = () => {
      var jsonItem = { ...tmItem };
      delete jsonItem.__setValue;
      delete jsonItem.__toJson;
      delete jsonItem.__isInitialized;
      delete jsonItem.__cleanItem;
      return jsonItem;
    };

    sItem.current = new StateContext(
      tmItem,
      (v) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          trigger.current(getItem(v));
        }, keyTimeout);
      },
      hierarkiTree,
      ignoreObjectKeyNames
    );

    return sItem.current;
  };

  sItem.current = sItem.current !== undefined ? sItem.current : getItem(item);
  const [tItem, setTItem] = React.useState(sItem.current);
  trigger.current = setTItem;
  React.useEffect(() => {
    mountedTimeout.current = setTimeout(() => (tItem.__isInitialized = true), 100);
    return () => {
      clearTimeout(mountedTimeout.current);
      clearTimeout(timer.current);
      tItem.__isInitialized = false;
      sItem.current = undefined;
    };
  }, []);
  return tItem;
};

module.exports = CreateContext;