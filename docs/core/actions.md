# Actions

`Actions`相当于组件中的 [`methods`](https://v3.vuejs.org/guide/data-methods.html#methods) 。可以使用`defineStore()`中的`actions`属性来定义它们，并且它们非常适合定义业务逻辑：

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  actions: {
    increment() {
      this.counter++
    },
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random())
    },
  },
})
```

和[getters](https://baimingxuan.net/pinia-doc-cn/core/getters.html)一样，`actions`通过`this`来访问整个`store`实例，还有完整的类型支持（和自动补全功能）。与它们不同的是，**`actions`**可以是异步的，您可以在它们内部进行任何`API`的调用，甚至其他操作！下面是一个使用[Mande](https://github.com/posva/mande)的示例。请注意，只要你得到了一个`Promise` ，你使用什么样的库并不重要，您甚至可以使用原生的`fetch`函数（仅适用于浏览器端）：

```js
import { mande } from 'mande'

const api = mande('/api/users')

export const useUsers = defineStore('users', {
  state: () => ({
    userData: null,
    // ...
  }),

  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password })
        showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // let the form component display the error
        return error
      }
    },
  },
})
```

您也可以完全自由地设置任何您想要的参数并返回任何东西。当调用`actions`时，一切都会被自动推断出来!

`actions`与`methods`调用类似：

```js
export default defineComponent({
  setup() {
    const main = useMainStore()
    // call the action as a method of the store
    main.randomizeCounter()

    return {}
  },
})
```



## 访问其他 stores 的 actions

要使用另一个`store`，您可以直接在`action`内部使用它：

```js
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // ...
  }),
  actions: {
    async fetchUserPreferences(preferences) {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error('User must be authenticated')
      }
    },
  },
})
```



## setup() 中的用法

您可以直接调用任何`action`作为`store`的方法：

```js
export default {
  setup() {
    const store = useStore()

    store.randomizeCounter()
  },
}
```



## Options API 中的用法

对于以下示例，您可以假设创建了以下`store `:

```js
// Example File Path:
// ./src/stores/counterStore.js

import { defineStore } from 'pinia'

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  }),
  actions: {
    increment() {
      this.counter++
    }
  }
})
```

### 使用 setup() 

虽然`Composition API`并不适合所有人，但`setup()`钩子可以让`Pinia`更容易在`Options API`中使用。不需要额外的辅助函数！

```js
import { useCounterStore } from '../stores/counterStore'

export default {
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  methods: {
    incrementAndPrint() {
      counterStore.increment()
      console.log('New Count:', counterStore.count)
    },
  },
}
```

### 不使用 setup()

如果您根本不想使用`Composition API`，您可以使用`mapActions()`辅助函数将`actions`属性映射为组件中的`methods`：

```js
import { mapActions } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  methods: {
    // gives access to this.increment() inside the component
    // same as calling from store.increment()
    ...mapActions(useCounterStore, ['increment']),
    // same as above but registers it as this.myOwnName()
    ...mapActions(useCounterStore, { myOwnName: 'doubleCounter' }),
  },
}
```



## 订阅 actions

可以使用`store.$onAction()`来观察`actions`及其结果。传递给它的回调函数在`action`本身之前执行。在处理`promises`之后，允许您在`action resolves`之后执行函数。类似地，`onError`允许你在`action`抛出或`rejects`时执行函数。这些对于在运行时跟踪错误很有用，类似于[Vue文档中的这个技巧。](https://v3.cn.vuejs.org/guide/tooling/deployment.html#%E8%B7%9F%E8%B8%AA%E8%BF%90%E8%A1%8C%E6%97%B6%E9%94%99%E8%AF%AF)

下面是一个在运行`actions`之前和`resolve/reject`之后记录日志的示例。

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // name of the action
    store, // store instance, same as `someStore`
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    onError, // hook if the action throws or rejects
  }) => {
    // a shared variable for this specific action call
    const startTime = Date.now()
    // this will trigger before an action on `store` is executed
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // this will trigger if the action succeeds and after it has fully run.
    // it waits for any returned promised
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // this will trigger if the action throws or returns a promise that rejects
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// manually remove the listener
unsubscribe()
```

默认情况下，`action`订阅被绑定到添加它们的组件（如果`store`在组件的`setup()`中）。这就意味着，当组件被卸载时，它们将被自动删除。如果你想在组件卸载后保留它们，传`true`作为第二个参数，以将操作订阅与当前组件分离：

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // this subscription will be kept after the component is unmounted
    someStore.$onAction(callback, true)

    // ...
  },
}
```
