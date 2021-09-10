# Getting Started

`npm install @alentoma/useState`

```js
const item = objectUseState({
    counter: 0,
    counter2: 0,
    text: "",
    item: { ItemCounter: 0 },
  });
  
  
    React.useEffect(() => {
    console.log('counter is Changed');
    console.log(item);
  }, [item.counter]);
  
  
  return (<Text onPress={()=> item.counter+=1}> {item.counter} </Text>)
```

### example 

https://snack.expo.dev/@alentoma/usestatealternative
