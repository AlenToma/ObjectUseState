import { useState } from 'react';

const wait = (time: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

const set = async (value: any, keyValue: any, key: string, setValue: Function, parent: any) => {
  while (parent.wait)
    await wait(200);
  try {
    parent.wait = true;

    if (value != keyValue) await setValue(value);
    parent.wait = false;
  } catch (error) {
    console.log(error);
    parent.wait = false;
    throw error;
  }
}

const assign = (item: any, assignTo: any) => {
  var tItem = item as any;
  Object.keys(item).forEach((key) => {
    var thisAny = assignTo as any;
    if (
      tItem[key] &&
      typeof tItem[key] === 'object' &&
      tItem[key] !== null &&
      !Array.isArray(tItem[key])
    )
      thisAny[key] = new UseState(tItem[key]);
    else {
      const [keyValue, setValue] = useState(tItem[key]);
      thisAny[key] = keyValue;
      Object.defineProperty(thisAny, key, {
        get() {
          return keyValue;
        },
        set(value) {
          set(value, keyValue, key, setValue, assignTo);
        },
      });
    }
  });
};

class UseState<T> {
  constructor(item: T) {
    assign(item, this);
  }

  public setValue = (item: T) => {
    const thisAny = this as any;
    Object.keys(item).forEach((x) => {
      var v = (item as any)[x];
      if (v && typeof v === 'object' && v !== null && !Array.isArray(v))
        thisAny[x].setValue(v);
      else thisAny[x] = v;
    });
  };
}

export default <T>(item: T) => {
  const state = new UseState<T>(item) as T | UseState<T>;
  return state as T;
};
