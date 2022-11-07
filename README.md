# Getting Started

`npm install @alentoma/usestate`
## Why use ObjectUseState
Well imagine that you have to many `usestate`. then you will also have to keep an eye for each and then await and so on. 

Well with this library you can use an object as a `usestate` and it will be able to work the same as a simple `react.useState` when you change each property.

This Library also make thing faster when you have to many operation and changes to the states as it create a waiting list behind the code and make sure each changes is applied before the next change to be trigger.

The assign oepration is a sync operation, mening that you could already use the assigned data without waiting for useEffect to trigger.

```js
import objectUseState from '@alentoma/usestate'

const state = objectUseState({
    counter: 0,
    item: { itemCounter: 0 },
    items:[]
  });
  
  React.useEffect(() => {
    if (!state.__isInitialized) return; // Optional
    console.log('counter is Changed');
  }, [state.counter]);

  React.useEffect(() => {
    if (!state.__isInitialized) return; // Optional
    console.log('itemCounter is Changed');
  }, [state.item.itemCounter]);

  React.useEffect(() => {
    if (!state.__isInitialized) return; // Optional
    console.log('items is Changed');
  }, [state.items]);
  
  // reset only counter and item
  const resetItem=()=> {
   state.__setValue({
      counter: 0,
      item: { itemCounter: 0 },
    });
  }
  
  return (
  <>
  <Text onPress={()=> {
    state.counter++
    console.log(state.counter) // you will see here that counter has increased already eg is a sync operation.
  }}> click to increate Counter {state.counter} </Text>
  <Text onPress={()=> state.item.itemCounter++}> click to increase ItemCounter {state.item.itemCounter} </Text>
  <Text onPress={()=> state.items = [...state.items, "02"]}> click to increase items {state.items.length} </Text>
  </>
  )
```

## objectUseState constructor parameters

| ParameterName | DefaulValue | Description |
| :---: | :---: | :---: |
| Item | T[Generic] | assiged object for useState |
| hierarkiTree | true | Create trigger for all object tree, eg itemCounter for the above example |
| ignoreObjectKeyNames | undefined | The library will trigger change on propertyChange and this will rerender the component , use this if you want to execlude some object from this eg ["item"] for the above example. This is ofter used when you have a circular references problem  |

## Properties
| propertyName | DefaulValue | Description |
| :---: | :---: | :---: |
| __isInitialized | boolean(readonly) false | this is a value that is set after the context has been Initialized  |
## Methods
| methodName  | Description |
| :---: | :---: |
| __setValue | Assign Object as Value  |
| __toJson | A Clean json string value without the additional properties added from the library  |

## Limitations

* accept only objects and not arrays for the useState.

### example 

https://snack.expo.dev/@alentoma/usestatealternative
