import * as React from 'react';
const __ignoreKeys = ['__setValue', '__toJson', '__cleanItem'];

class StateContext {
  constructor(item, trigger, hierarkiTree, ignoreObjectKeyNames) {
    try {
      let keys = Object.keys(item).filter((x) => !__ignoreKeys.includes(x));
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
          val = new StateContext(
            val,
            () => trigger(item),
            hierarkiTree,
            ignoreObjectKeyNames
          );
        }

        Object.defineProperty(this, key, {
          get: () => val,
          set: (value) => {
            let oValue = value;
            if (
              hierarkiTree !== false &&
              (ignoreObjectKeyNames == undefined ||
                !ignoreObjectKeyNames.find((x) => x === key)) &&
              typeof value === 'object' &&
              !Array.isArray(value) &&
              value !== undefined &&
              value !== null &&
              typeof value !== 'string'
            ) {
              value = new StateContext(
                oValue,
                () => trigger(item),
                hierarkiTree,
                ignoreObjectKeyNames
              );
            }
            item[key] = oValue;
            val = value;
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

const CreateContext = (item, hierarkiTree, ignoreObjectKeyNames) => {
  const sItem = React.useRef();
  const trigger = React.useRef();
  const timer = React.useRef();

  const getItem = (tmItem) => {
    if (tmItem.__isInitialized === undefined) tmItem.__isInitialized = false;
    sItem.current = new StateContext(
      tmItem,
      (v) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          trigger.current(getItem(v));
        }, 0);
      },
      hierarkiTree,
      ignoreObjectKeyNames
    );

    sItem.current.__setValue = (v) => {
      trigger.current(getItem({ ...tmItem, ...v }));
    };

    sItem.current.__toJson = (v) => {
      {
        return JSON.stringify(tmItem.__cleanItem());
      }
    };

    sItem.current.__cleanItem = () => {
      let jsonItem = { ...tmItem };
      delete jsonItem.__setValue;
      delete jsonItem.__toJson;
      delete jsonItem.__isInitialized;
      delete jsonItem.__cleanItem;
      return jsonItem;
    };

    return sItem.current;
  };

  sItem.current = sItem.current !== undefined ? sItem.current : getItem(item);
  const [tItem, setTItem] = React.useState(sItem.current);
  trigger.current = setTItem;
  React.useEffect(() => {
    tItem.__isInitialized = true;

    return () => {
      tItem.__isInitialized = false;
      sItem.current = undefined;
      clearTimeout(timer.current);
    };
  }, []);
  return tItem;
};

module.exports = CreateContext;
