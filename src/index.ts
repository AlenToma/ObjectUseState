import { useState } from 'react';

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
          if (
            value &&
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value)
          )
            throw 'Cant set an object';
          else if (value != keyValue) setValue(value);
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
