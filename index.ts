import { useState } from 'react';

const addToWait = async <T>(
  value: any,
  setValue: Function,
  parent: UseState<T>
) => {

  if (parent.awaitAll) {
    parent.watingList.push(
      async () => await set(value, setValue, parent)
    );
    if (parent.isWorking) return;
    parent.isWorking = true;
    while (parent.watingList.length > 0) {
      await parent.watingList[0]();
    }
    parent.isWorking = false;
  }
  else await set(value, setValue, parent);

};

const set = async <T>(
  value: any,
  setValue: Function,
  parent: UseState<T>
) => {
  try {
    await setValue(value);
    if (parent.awaitAll) {
      parent.watingList.shift();
    }
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
        false,
        assignTo.awaitAll
      );
    } else {
      const [keyValue, setValue] = useState(tItem[key]);
      thisAny[key] = keyValue;
      Object.defineProperty(thisAny, key, {
        get() {
          return keyValue;
        },
        set(value) {
          return addToWait<T>(value, setValue, assignTo);
        },
      });
    }
  });
};

class UseState<T> {
  watingList: any[];
  isWorking: boolean;
  hierarkiUseState: boolean;
  awaitAll: boolean
  constructor(
    item: T,
    hierarkiUseState?: boolean,
    awaitAll?: boolean
  ) {
    this.watingList = [];
    this.isWorking = false;
    this.hierarkiUseState = hierarkiUseState ?? true;
    this.awaitAll = awaitAll ?? true;
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
  awaitAll?: boolean
) => {
  const state = new UseState<T>(item, hierarkiUseState, awaitAll) as
    | T
    | UseState<T>;
  return state as T;
};
