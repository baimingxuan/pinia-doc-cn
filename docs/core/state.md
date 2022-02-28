# State

大多数时候，`state`是`Store`的中心部分。人们通常从定义应用程序的`state`开始。在`Pinia` 中，`state`被定义为一个返回初始`state`的函数。这保证了`Pinia`在服务器端和客户端都能使用。

```js
import { defineStore } from 'pinia'

const useStore = defineStore('storeId', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      counter: 0,
      name: 'Eduardo',
      isAdmin: true,
    }
  },
})
```

> TIP
>
> 如果您使用`Vue 2`，您在`state`中创建的数据应遵循与`Vue`实例中`data`相同的规则，即 `state`对象必须是普通的，并且在向其添加新属性时需要调用`Vue.set()`。另请参阅：[Vue#data](https://vuejs.org/v2/api/#data)



## 访问State

默认情况下，你可以通过`Store`实例直接读写`state`:

```js
const store = useStore()

store.counter++
```



## 重置State

您可以通过调用`store`上的`$reset()`方法将`state`重置为初始值:

```js
const store = useStore()

store.$reset()
```

### 使用Options API

对于以下示例，您可以假设创建了以下`store`:

```js
// Example File Path:
// ./src/stores/counterStore.js

import { defineStore } from 'pinia'

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  })
})
```

### 使用setup()

虽然`Composition API`并不适合所有人，但是`setup()`钩子可以让`Pinia`更容易在`Options API`中使用。不需要额外的辅助函数!

```js
import { useCounterStore } from '../stores/counterStore'

export default {
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  computed: {
    tripleCounter() {
      return counterStore.counter * 3
    },
  },
}
```

### 不使用setup()

如果您不使用`Composition API`，而您使用的是`computed`, `methods`，…，则你可以使用`mapState()`辅助函数将状态属性映射为只读计算属性：

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // gives access to this.counter inside the component
    // same as reading from store.counter
    ...mapState(useCounterStore, ['counter']),
    // same as above but registers it as this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'counter',
      // you can also write a function that gets access to the store
      double: store => store.counter * 2,
      // it can have access to `this` but it won't be typed correctly...
      magicValue(store) {
        return store.someGetter + this.counter + this.double
      },
    }),
  },
}
```

#### 可修改的 State

如果您希望能够写入这些状态属性（例如，如果您有一个表单），您可以使用`mapWritableState()`代替。请注意，您不能像`mapState()`那样传递函数：

```js
import { mapWritableState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // gives access to this.counter inside the component and allows setting it
    // this.counter++
    // same as reading from store.counter
    ...mapWritableState(useCounterStore, ['counter']),
    // same as above but registers it as this.myOwnName
    ...mapWritableState(useCounterStore, {
      myOwnName: 'counter',
    }),
  },
}
```

> TIP
> 您不需要`mapWritableState()`来处理像数组这样的集合，除非你用`cartItems = []`来替换整个数组，`mapState()`仍然允许你在你的集合上调用方法。



## 改变 State

除了直接使用`store.counter++` 改变`store`之外，你也可以调用`$patch`方法。它允许您使用部分`state`对象同时应用到多个改变:

```js
store.$patch({
  counter: store.counter + 1,
  name: 'Abalam',
})
```

然而，使用这种语法应用某些改变确实很难或代价高昂：任何集合修改(例如，从数组中添加、删除、修改元素）都需要您创建一个新集合。正因为如此，`$patch`方法也接受一个函数来对这种难以应用于`patch`对象的改变进行分组:

```js
cartStore.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

这里的主要区别是`$patch()`允许您在`devtools`中将多个改变分组到一个条目中。注意，对**`state`**和**`$patch()`**的直接更改将呈现在`devtools`中，并且需要花费些时间(在`Vue 3`中还没出现)。



## 替换 State

您可以通过将`store`的`$state`属性设置一个新对象来替换整个`store`的状态:

```js
store.$state = { counter: 666, name: 'Paimon' }
```

您还可以通过更改 `pinia`实例的`state`来替换应用程序的整个状态。这在[SSR 注水](https://pinia.vuejs.org/ssr/#state-hydration)中使用。

```js
pinia.state.value = {}
```



## 订阅 State

您可以通过`store`的`$subscribe()`方法查看状态及其变化，这与`Vuex`的 [subscribe 方法](https://vuex.vuejs.org/api/#subscribe)类似。与常规的`watch()`相比，使用`$subscribe()`的优势在于，订阅只会在`patches`之后触发一次(例如，当使用上面的函数版本时)。

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // same as cartStore.$id
  mutation.storeId // 'cart'
  // only available with mutation.type === 'patch object'
  mutation.payload // patch object passed to cartStore.$patch()

  // persist the whole state to the local storage whenever it changes
  localStorage.setItem('cart', JSON.stringify(state))
})
```

默认情况下，状态订阅被绑定到添加它们的组件上(如果`store`在组件的`setup()`中)。这意味着，当组件被卸载时，它们将被自动删除。如果你想在组件卸载后保留它们，传递`{ detached: true }` 作为第二个参数来从当前组件中分离状态订阅:

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // this subscription will be kept after the component is unmounted
    someStore.$subscribe(callback, { detached: true })

    // ...
  },
}
```

> TIP
> 您可以查看`Pinia```实例上的整个状态：

```js
watch(
  pinia.state,
  (state) => {
    // persist the whole state to the local storage whenever it changes
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true }
)
```
