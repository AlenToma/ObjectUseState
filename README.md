# Getting Started

`npm install @alentoma/usestate`

```js
import useState from '@alentoma/usestate'


const item = useState({
    counter: 0,
    counter2: 0,
    text: "",
    item: { ItemCounter: 0 },
  });
  
  
    React.useEffect(() => {
    console.log('counter is Changed');
    console.log(item);
  }, [item.counter]);
  

  const resetItem=()=> {
    item.setValue({
      counter: 0,
      counter2: 0,
      text: "hahaha",
      item: { ItemCounter: 0 },
    });
  }
  
  return (<Text onPress={()=> item.counter+=1}> {item.counter} </Text>)
```

### example 

https://snack.expo.dev/@alentoma/usestatealternative
