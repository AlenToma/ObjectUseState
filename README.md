# Getting Started

`npm install @alentoma/usestate`
## Why use ObjectUseState
Well imagine that you have to many `usestate`. then you will also have to keep an eye for each and then await and so on. 

Well with this library you can use an object as a `usestate` and it will be able to work the same as a simple `react.useState` when you change each property.

This Library also make thing faster when you have to many operation and changes to the states as it create a waiting list behind the code and make sure each changes is applied before the next change to be trigger.

```js
import objectUseState from '@alentoma/usestate'

const state = objectUseState({
    counter: 0,
    item: { itemCounter: 0 },
    items:[]
  });
  
  
    React.useEffect(() => {
    console.log('counter is Changed');
  }, [state.counter]);
  
   React.useEffect(() => {
    console.log('itemCounter is Changed');
  }, [state.item.itemCounter]);
  
     React.useEffect(() => {
    console.log('items is Changed');
  }, [state.items]);
  
  // reset only counter and item
  const resetItem=()=> {
   (state as any).setValue({
      counter: 0,
      item: { itemCounter: 0 },
    });
  }
  
  return (
  <>
  <Text onPress={()=> state.counter++}> click to increate Counter {state.counter} </Text>
  <Text onPress={()=> state.item.itemCounter++}> click to increase ItemCounter {state.item.itemCounter} </Text>
  <Text onPress={()=> state.items = [...state.items, "02"]}> click to increase items {state.items.length} </Text>
  </>
  )
```

## objectUseState constructor parameters

| ParameterName | DefaulValue | Description |
| :---: | :---: | :---: |
| Item | T[Generic] | assiged object for useState |
| hierarkiUseState | true |this will be able to tell to create useState for children objects like the above example [item.ItemCounter] |

## Limitations

* accept only objects and not arrays for the useState.
* hierarkiUseState only apply for objects and not array.

### example 

https://snack.expo.dev/@alentoma/usestatealternative
