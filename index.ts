import { useState } from 'react';

const addToWait = async <T>(
  value: any,
  keyValue: any,
  key: string,
  setValue: Function,
  parent: UseState<T>
) => {
  parent.watingList.push(
    async () => await set(value, keyValue, key, setValue, parent)
  );
  if (parent.isWorking) return;
  parent.isWorking = true;
  while (parent.watingList.length > 0) {
    await parent.watingList[0]();
  }
  parent.isWorking = false;
};

const set = async <T>(
  value: any,
  keyValue: any,
  key: string,
  setValue: Function,
  parent: UseState<T>
) => {
  try {
    await setValue(value);
    parent.watingList.shift();
  } catch (error) {
    console.log(error);
    parent.watingList.shift();
    throw error;
  }
};

const assign = <T>(item: any, assignTo: UseState<T>) => {
  var tItem = item as any;
  Object.keys(item).forEach((key) => {
    const thisAny = assignTo as any;
    if (
      assignTo.hierarkiUseState &&
      tItem[key] &&
      typeof tItem[key] === 'object' &&
      tItem[key] !== null &&
      !Array.isArray(tItem[key])
    ) {

      thisAny[key] = new UseState(
        tItem[key],
        assignTo.hierarkiUseState
      );
    } else {
      const [keyValue, setValue] = useState(tItem[key]);
      thisAny[key] = keyValue;
      Object.defineProperty(thisAny, key, {
        get() {
          return keyValue;
        },
        set(value) {
          return addToWait<T>(value, keyValue, key, setValue, assignTo);
        },
      });
    }
  });
};

class UseState<T> {
  watingList: any[];
  isWorking: boolean;
  hierarkiUseState: boolean;
  constructor(
    item: T,
    hierarkiUseState?: boolean,
  ) {
    this.watingList = [];
    this.isWorking = false;
    this.hierarkiUseState = hierarkiUseState ?? true;
    assign(item, this);
  }


  public setValue = (item: T) => {
    const thisAny = this as any;
    Object.keys(item).forEach((x) => {
      var v = (item as any)[x];
      if (
        this.hierarkiUseState &&
        v &&
        typeof v === 'object' &&
        v !== null &&
        !Array.isArray(v)
      )
        thisAny[x].setValue(v);
      else thisAny[x] = v;
    });
  };
}

export default <T>(
  item: T,
  hierarkiUseState?: boolean,
) => {
  const state = new UseState<T>(item, hierarkiUseState) as
    | T
    | UseState<T>;
  return state as T;
};
