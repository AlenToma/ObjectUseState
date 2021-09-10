# Getting Started

`npm install @alentoma/usestate`
## Why use ObjectUseState
Well imagine that you have to many `usestate`. then you will also have to keep an eye for each and then await and so on. 

Well with this library you can use an object as a `usestate` and it will be able to work the same as a simple `react.useState` when you change each property.

This Library also make thing faster when you have to many operation and changes to the states as it create a waiting list behind the code and make sure each changes is applied before the next change to be trigger.

```js
import useState from '@alentoma/usestate'

const state = useState({
    counter: 0,
    counter2: 0,
    text: "",
    item: { ItemCounter: 0 },
    items:[]
  });
  
  
    React.useEffect(() => {
    console.log('counter is Changed');
    console.log(item);
  }, [state.counter]);
  

  const resetItem=()=> {
    state.setValue({
      counter: 0,
      counter2: 0,
      text: "hahaha",
      item: { ItemCounter: 0 },
    });
  }
  
  return (<Text onPress={()=> state.counter+=1}> {state.counter} </Text>)
```

## useState constructor 

```js
* Item: T // assiged object
* hierarkiUseState: boolean[default true] // this will be able to tell to create useState for children objects like the above example [item].
```

## Limitations

* accept only objects and not arrays for the useState.
* hierarkiUseState only apply for objects and not array.

### example 

https://snack.expo.dev/@alentoma/usestatealternative
