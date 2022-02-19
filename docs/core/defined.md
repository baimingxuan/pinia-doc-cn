# 定义Store

在进入核心概念之前，我们需要知道 Store 是使用defineStore()定义的，并且它需要一个

唯一的名称，作为第一个参数传递：

```vue
import { defineStore } from 'pinia'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore('main', {
  // other options...
})
```

这个名称（也称为id）是必需的，Pania 使用它来将 Store 连接到 devtools。将返回的函数命名为use...是可组合项之间的约定，以使其用法符合使用习惯。



## 使用Store

我们定义了一个 Store，因为只有在 setup() 中调用了 useStore() ，Store 才会被创建：

```vue
import { useStore } from '@/stores/counter'

export default {
  setup() {
    const store = useStore()

    return {
      // you can return the whole store instance to use it in the template
      store,
    }
  },
}
```

您可以根据需要定义任意数量的 Store，并且应该在不同的文件中定义每个 Store 以充分利用 Pinia（例如自动允许您的 bundle 进行代码拆分和 TypeScript 推理）。

如果您还没有使用 setup 组件，您仍然可以将 Pinia 与辅助函数一起使用。

一旦 Store 被实例化，您就可以直接在 Store 上访问在 state、getters 和actions 中定义的任何属性。我们将在下一页中看到这些细节，但自动补全将帮助你。 

请注意，Store 是一个用 reactive 包装的对象，这意味着不需要在 getter 后面写 .value，但是，就像 setup 中的 props 一样，我们不能对它进行解构:

```vue
export default defineComponent({
  setup() {
    const store = useStore()
    // ❌ This won't work because it breaks reactivity
    // it's the same as destructuring from `props`
    const { name, doubleCount } = store

    name // "eduardo"
    doubleCount // 2

    return {
      // will always be "eduardo"
      name,
      // will always be 2
      doubleCount,
      // this one will be reactive
      doubleValue: computed(() => store.doubleCount),
      }
  },
})
```

为了从 Store 中提取属性，同时保持其响应性，您需要使用 storeToRefs() 。它将为任何响应性属性创建引用。当您仅使用 Store 中的 state，但不调用任何操作时，这很有用：

```vue
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const store = useStore()
    // `name` and `doubleCount` are reactive refs
    // This will also create refs for properties added by plugins
    // but skip any action or non reactive (non ref/reactive) property
    const { name, doubleCount } = storeToRefs(store)

    return {
      name,
      doubleCount
    }
  },
})
```