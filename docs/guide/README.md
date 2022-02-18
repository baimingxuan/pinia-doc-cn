# Pinia中文文档（基础）（详细翻译官方文档）

## 介绍

**Pinia** 最初是在2019年11月左右使用 Composition API 重新设计 Vue Store 的一个实验。从那时起，最初的原则仍然相同，但 Pinia 同时适用于 Vue 2 和 Vue 3，并且不要求您使用Composition API。除了安装和 SSR 之外，两者的 API 都是相同的，这些文档针对 Vue 3，并在必要时提供有关 Vue 2 的注释，以便 Vue 2 和 Vue 3 的用户可以阅读！

## 为什么要使用 Pinia？

Pinia 是 Vue 的一个 Store，它允许您跨组件/页面共享状态。如果您熟悉 Composition API，您可能会认为您已经可以用一个简单的 export const state = reactive({})来共享一个全局状态 。这对于单页应用程序来说是正确的，但是如果应用程序是在服务器端呈现的，那么它就会暴露出安全漏洞。但即使在小型单页应用程序中，使用 Pinia 也能获得很多好处：

- Devtools 支持

- - 追踪 actions, mutations 的时间线
  - stores 出现在使用它们的组件中
  - 时间旅行和更方便的调试

- 热模块更新

- - 在不重新加载页面的情况下修改 stores
  - 在开发过程中保持任何现有状态

- 插件：使用插件扩展 Pinia 功能

- 为JS 用户提供正确的 TypeScript 支持或自动补全功能

- 服务器端渲染支持

## 基础示例

这就是在 API 方面使用 Pinia 的样子（请务必查看入门指南中的完整说明）。首先创建一个 Store：







```
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    },
  },
})
```



然后在组件中使用它：







```
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const counter = useCounterStore()

    counter.count++
    // with autocompletion ✨
    counter.$patch({ count: counter.count + 1 })
    // or using an action instead
    counter.increment()
  },
}
```



您甚至可以使用一个函数（类似于组件的 setup() ）来为更高级的用例定义一个 Store：







```
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```



如果您还不熟悉 setup() 和 Composition API，不用担心，Pinia 还支持一组类似 Vuex 的辅助函数。您也可以用同样的方式定义 Store，但是要使用 mapStores()、mapState() 或 mapActions() 调用它：







```
const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    }
  }
})

const useUserStore = defineStore('user', {
  // ...
})

export default {
  computed: {
    // other computed properties
    // ...
    // gives access to this.counterStore and this.userStore
    ...mapStores(useCounterStore, useUserStore)
    // gives read access to this.count and this.double
    ...mapState(useCounterStore, ['count', 'double']),
  },
  methods: {
    // gives access to this.increment()
    ...mapActions(useCounterStore, ['increment']),
  },
}
```



您将在核心概念中找到关于辅助函数的更多信息。

## 为什么叫 Pinia

Pinia（发音为 /piːnjʌ/，就像英语中的 “peenya”）是最接近piña（西班牙语中的 “菠萝pineapple”）的一个有效的包名。事实上，菠萝是一群单独的花朵结合在一起，形成了多个果实的一种水果。与 Stores 类似，每个 store 都是独立生成的，但他们最终都是连接在一起的。菠萝也是一种原产于南美洲的美味热带水果。

## 一个更实际的示例

下面是一个更完整的API示例，您将在 Pinia 中使用它，甚至在 JavaScript 中使用它的类型。对于一些人来说，这可能已经足够了，不需要进一步阅读就可以开始了，但我们仍然建议阅读完文档的其余部分，甚至跳过这个例子，当你阅读了所有的核心概念后再回来。







```
import { defineStore } from 'pinia'

export const todos = defineStore('todos', {
  state: () => ({
    /** @type {{ text: string, id: number, isFinished: boolean }[]} */
    todos: [],
    /** @type {'all' | 'finished' | 'unfinished'} */
    filter: 'all',
    // type will be automatically inferred to number
    nextId: 0,
  }),
  getters: {
    finishedTodos(state) {
      // autocompletion! ✨
      return state.todos.filter((todo) => todo.isFinished)
    },
    unfinishedTodos(state) {
      return state.todos.filter((todo) => !todo.isFinished)
    },
    /**
     * @returns {{ text: string, id: number, isFinished: boolean }[]}
     */
    filteredTodos(state) {
      if (this.filter === 'finished') {
        // call other getters with autocompletion ✨
        return this.finishedTodos
      } else if (this.filter === 'unfinished') {
        return this.unfinishedTodos
      }
      return this.todos
    },
  },
  actions: {
    // any amount of arguments, return a promise or not
    addTodo(text) {
      // you can directly mutate the state
      this.todos.push({ text, id: this.nextId++, isFinished: false })
    },
  },
})
```



## 与 Vuex 对比



Pinia 最初是为了探索 Vuex 的下一次迭代会是什么样子，整合了核心团队关于 Vuex 5 的许多想法。最终，我们意识到 Pinia 已经实现了我们在 Vuex 5 中想要的大部分内容，并决定实现它取而代之的一种思考。











与 Vuex 相比，Pinia 提供了一个更简单、更不规范的 API，提供了 Composition-API 风格的一些 API，更重要的是，在与 TypeScript 一起使用时，它提供了可靠的类型推断支持。

### RFCs









Vuex 通过 RFC 收集尽可能多的社区反馈，而 Pinia 却没有。我根据自己开发应用程序、阅读其他人的代码、为使用 Pinia 的客户工作以及在 Discord 上回答问题的经验来测试想法。这使我能够提供一种适用于各种情况和应用程序大小的有效解决方案。我经常发布版本，并在保持其核心 API 不变的同时，使库不断发展。

### 与 Vuex 3.x/4.x 对比

> Vuex 3.x 是 Vuex 的 Vue 2 而 Vuex 4.x 是 Vue 3

Pinia API 与 Vuex ≤4 有很大差异，如：



- mutations 不再存在。它们经常被认为非常啰嗦。它们最初带来了 devtools 的集成，但这不再是一个问题。

- 无需创建复杂的自定义包装器来支持 TypeScript，所有东西都是类型化的，并且 API 的设计也尽可能利用 TS 类型推断。

- 无需额外的魔法字符串注入、引入函数和回调，享受自动完成的功能！

- 无需动态添加 Stores，默认情况下它们都是动态的，您甚至都不会注意到。

  注意，您仍然可以在需要时使用 Store 手动注册，但因为它是自动的，所以您无需担心后续。

- 不再有模块的嵌套结构。您仍然可以通过在另一个 Store 中导入和使用 Store 来隐式嵌套的 Store，但是 Pinia 在设计提供了一个扁平的结构，同时仍然支持 Stores 之间的交叉组合方式。你甚至可以有 Store 的循环依赖关系。

- 没有模块的命名空间。鉴于商店的扁平架构，“命名空间”的 Store 是其定义方式所固有的，您可以说所有 Store 都是命名空间的。



有关如何将一个现有的 Vuex ≤4 项目转换为使用 Pinia 的更详细说明，请参阅从 Vuex 迁移指南。



## 安装

使用您最喜欢的包管理工具安装pinia：







```
yarn add pinia
# or with npm
npm install pinia
```



> TIP
> 如果您的应用使用的是Vue 2，你还需要安装 composition api: @vue/composite-api。如果您正在使用Nuxt，则应遵循这些说明。

如果你使用的是 Vue CLI，你可以试试这个非官方的插件。

创建一个 pinia（the root store）并将其传递给应用程序：







```
import { createPinia } from 'pinia'

app.use(createPinia())
```



如果您使用的是Vue 2，您还需要安装一个插件，并将创建的 pinia 注入到应用程序的根目录:







```
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  // other options...
  // ...
  // note the same `pinia` instance can be used across multiple Vue apps on
  // the same page
  pinia,
})
```







这也将添加 devtools 支持。在 Vue 3 中，像时间旅行和编辑这样的功能仍然不被支持，因为vue-devtools尚未公开必要的 api，但 devtools 具有更多的功能，总体来说，开发人员的体验要优越得多。在 Vue 2 中，Pinia 使用了 Vuex 的现有接口(因此不能与Vuex一起使用)。

## 什么是Store？

Store (如Pinia)是保存状态和业务逻辑的实体，它没有绑定到组件树。换句话说，它承载全局状态。它有点像一个总是存在的组件，每个人都可以读取和写入。它有三个核心概念，state、getters 和 actions，可以想当然地认为这些概念等同于组件中的 data、computed 和 methods。

## 什么时候应该使用Store

Store 应该包含可以在整个应用程序中访问的数据。这包括在很多地方使用的数据，例如在导航栏中显示的用户信息，以及需要通过页面保存的数据，例如非常复杂的多步骤表单。 

另一方面，你应该避免在存储中包含可能托管在组件中的本地数据，例如，页面本地元素的可见性。 

并不是所有的应用程序都需要访问全局状态，但是如果您需要，Pinia 将使您的工作更轻松。



# 定义Store

在进入核心概念之前，我们需要知道 Store 是使用defineStore()定义的，并且它需要一个

唯一的名称，作为第一个参数传递：







```
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







```
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







```
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







```
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





# State

大多数时候，state 是 Store 的中心部分。人们通常从定义应用程序的 state 开始。在 Pinia 中，state 被定义为一个返回初始 state 的函数。这保证了 Pinia 在服务器端和客户端都能使用。







```
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
> 如果您使用Vue 2，您在 state 中创建的数据应遵循与 Vue 实例中数据相同的规则，即 state 对象必须是普通的，并且在向其添加新属性时需要调用 Vue.set()。
>
> 另请参阅：
>
> Vue#data
>
> 。

## 访问State

默认情况下，你可以通过 store 实例直接读写 state:







```
const store = useStore()

store.counter++
```



## 重置State

您可以通过调用 store 上的 $reset() 方法将 state 重置为初始值:







```
const store = useStore()

store.$reset()
```



### 使用Options API

对于以下示例，您可以假设创建了以下 Store:







```
// Example File Path:
// ./src/stores/counterStore.js

import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  })
})
```



### 在 setup() 中使用

虽然 Composition API 并不适合所有人，但是 setup() 钩子可以让 Pinia 更容易在 Options API中使用。不需要额外的辅助函数!







```
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



### 不在 setup() 中使用

如果您不使用 Composition API，而您使用的是 computed, methods，…，则你可以使用mapState() 辅助函数将状态属性映射为只读计算属性：







```
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // gives access to this.counter inside the component
    // same as reading from store.counter
    ...mapState(useCounterStore, ['counter'])
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



如果您希望能够写入这些状态属性（例如，如果您有一个表单），您可以使用 mapWritableState() 代替。请注意，您不能像 mapState() 那样传递函数：







```
import { mapWritableState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // gives access to this.counter inside the component and allows setting it
    // this.counter++
    // same as reading from store.counter
    ...mapWritableState(useCounterStore, ['counter'])
    // same as above but registers it as this.myOwnName
    ...mapWritableState(useCounterStore, {
      myOwnName: 'counter',
    }),
  },
}
```





> TIP
> 您不需要 mapWritableState() 来处理像数组这样的集合，除非你用 cartItems = [] 来替换整个数组，mapState() 仍然允许你在你的集合上调用方法。

## 改变 State

除了直接使用`store.counter++` 改变store之外，你也可以调用`$patch`方法。它允许您使用部分 state 对象同时应用到多个改变:







```
store.$patch({
  counter: store.counter + 1,
  name: 'Abalam',
})
```



然而，使用这种语法应用某些 mutations 确实很难或代价高昂：任何集合修改(例如，从数组中添加、删除、修改元素）都需要您创建一个新集合。正因为如此，`$patch`方法也接受一个函数来对这种难以应用于 patch 对象的 mutations 进行分组:







```
cartStore.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```



这里的主要区别是 $patch()允许您将多个变更分组到 devtools 中的一个条目中。注意，对**`state`**和**`$patch()`**的直接更改将呈现在 devtools 中，并且需要花费些时间(在Vue 3中还没出现)。

## 替换 State

您可以通过将 store 的 $state 属性设置一个新对象来替换整个 store 的状态:







```
store.$state = { counter: 666, name: 'Paimon' }
```



您还可以通过更改 `pinia`实例的 state 来替换应用程序的整个状态。这在[SSR for hydration](https://pinia.vuejs.org/ssr/#state-hydration)中使用。







```
pinia.state.value = {}
```



## 订阅 State

您可以通过 store 的 $subscribe() 方法查看 state 及其变化，这与 Vuex 的 [subscribe 方法](https://vuex.vuejs.org/api/#subscribe)类似。与常规的 watch() 相比，使用 $subscribe() 的优势在于，订阅只会在 patches 之后触发一次(例如，当使用上面的函数版本时)。







```
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



默认情况下，状态订阅被绑定到添加它们的组件上(如果 store 在组件的setup()中)。这意味着，当组件被卸载时，它们将被自动删除。如果你想在组件卸载后保留它们，传递`{ detached: true }` 作为第二个参数来从当前组件中分离 state 的订阅:







```
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
> 您可以查看 pinia 实例上的整个状态：







```
watch(
  pinia.state,
  (state) => {
    // persist the whole state to the local storage whenever it changes
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true }
)
```





# Getters

Getters 与 Store 的 state 计算值完全相同。它们可以用 defineStore()`中的 getters`
属性来定义。它们接收 state 作为第一个参数，鼓励使用箭头函数：







```
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
})
```



大多数时候，getters 只依赖于状态，但是，它们可能需要使用其他的 getters。因此，当定义一个常规函数时，我们可以通过 this 访问整个 store 实例，但需要定义返回类型的类型（在 Typescript 中）。这是由于 TypeScript 中的一个已知限制，不会影响使用箭头函数定义的 getters，也不会影响不使用 this 的 getters：







```
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // automatically infers the return type as a number
    doubleCount(state) {
      return state.counter * 2
    },
    // the return type **must** be explicitly set
    doublePlusOne(): number {
      // autocompletion and typings for the whole store ✨
      return this.counter * 2 + 1
    },
  },
})
```



然后你可以直接访问 store 实例 getter：







```
<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>

<script>
export default {
  setup() {
    const store = useStore()

    return { store }
  },
}
</script>
```



## 访问其他 getters

与计算属性一样，您可以组合多个 getters。通过 this 访问任何其他的 getters。即使您不使用 TypeScript，您也可以使用 JSDoc 提示 IDE 输入的类型：







```
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // type is automatically inferred because we are not using `this`
    doubleCount: (state) => state.counter * 2,
    // here we need to add the type ourselves (using JSDoc in JS). We can also
    // use this to document the getter
    /**
     * Returns the counter value times two plus one.
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // autocompletion ✨
      return this.doubleCount + 1
    },
  },
})
```



## 将参数传递给 getters

Getters只是后台的计算属性，因此不可能向它们传递任何参数。但是，您可以从 getter 返回一个函数来接受任何参数：







```
export const useStore = defineStore('main', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```



并在组件中使用：







```
<script>
export default {
  setup() {
    const store = useStore()

    return { getUserById: store.getUserById }
  },
}
</script>

<template>
  <p>User 2: {{ getUserById(2) }}</p>
</template>
```



请注意，执行此操作时，getters 不再被缓存，它们只是您调用的普通函数。但是，您可以在 getter 本身中缓存一些结果，这并不常见，但它证明性能更高：







```
export const useStore = defineStore('main', {
  getters: {
    getActiveUserById(state) {
      const activeUsers = state.users.filter((user) => user.active)
      return (userId) => activeUsers.find((user) => user.id === userId)
    },
  },
})
```



## 访问其他 Stores 的 getters

要使用其他store 的 getters，您可以直接在 getter 内部使用它：







```
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter(state) {
      const otherStore = useOtherStore()
      return state.localData + otherStore.data
    },
  },
})
```



## 使用 setup()

您可以直接访问任何 getter 作为 store 的属性（完全和 state 属性一样）：







```
export default {
  setup() {
    const store = useStore()

    store.counter = 3
    store.doubleCount // 6
  },
}
```



## 使用 Options API

对于以下示例，您可以假设创建了以下 store：







```
// Example File Path:
// ./src/stores/counterStore.js

import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  }),
  getters: {
    doubleCounter() {
      return this.counter * 2
    }
  }
})
```



### 在 setup() 中使用

虽然 Composition API 并不适合所有人，但是 setup() 钩子可以让 Pinia 更容易在 Options API 中使用。不需要额外的辅助函数！







```
import { useCounterStore } from '../stores/counterStore'

export default {
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  computed: {
    quadrupleCounter() {
      return counterStore.doubleCounter * 2
    },
  },
}
```



### 不在 setup() 中使用

[您可以像前一节](https://pinia.vuejs.org/core-concepts/state.html#options-api)的 state 一样使用 mapState() 函数来映射到 getters：







```
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // gives access to this.doubleCounter inside the component
    // same as reading from store.doubleCounter
    ...mapState(useCounterStore, ['doubleCount'])
    // same as above but registers it as this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'doubleCounter',
      // you can also write a function that gets access to the store
      double: store => store.doubleCount,
    }),
  },
}
```





# Actions

Actions 相当于组件中的 [methods](https://v3.vuejs.org/guide/data-methods.html#methods) 。可以使用 `defineStore()`中的 actions 属性来定义它们，并且它们非常适合定义业务逻辑：







```
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





和 [getter](https://pinia.vuejs.org/core-concepts/getters.html) 一样，actions 通过`this`来访问整个 store 实例，还有完整的类型支持（和自动补全功能）。与它们不同的是，**`actions`**可以是异步的，您可以在它们内部进行任何 API 的调用，甚至其他操作！下面是一个使用 [Mande 的示例。请注意，](https://github.com/posva/mande)只要你得到了[一个 `Promise`](https://github.com/posva/mande) ，你使用什么样的库并不重要，[您甚至可以使用](https://github.com/posva/mande)原生的 `fetch` 函数（仅适用于浏览器端）：

```
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

您也可以完全自由地设置任何您想要的参数并返回任何东西。当调用动作时，一切都会被自动推断出来!

Actions 与 methods 调用类似：







```
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

要使用另一个 store，您可以直接在 action 内部使用它：







```
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



## 使用 setup()

您可以直接调用任何 action 作为 store 的方法：







```
export default {
  setup() {
    const store = useStore()

    store.randomizeCounter()
  },
}
```

## 使用 Options API

对于以下示例，您可以假设创建了以下 store :







```
// Example File Path:
// ./src/stores/counterStore.js

import { defineStore } from 'pinia',

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



### 在 setup() 中使用

虽然 Composition API 并不适合所有人，但 setup() 钩子可以让 Pinia 更容易在 Options API中使用。不需要额外的辅助函数！







```
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



### 不在 setup() 中使用

如果您根本不想使用 Composition API，您可以使用 mapActions() 辅助函数将 actions 属性映射为组件中的 methods：







```
import { mapActions } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  methods: {
    // gives access to this.increment() inside the component
    // same as calling from store.increment()
    ...mapActions(useCounterStore, ['increment'])
    // same as above but registers it as this.myOwnName()
    ...mapActions(useCounterStore, { myOwnName: 'doubleCounter' }),
  },
}
```



## 订阅 actions

可以使用`store.$onAction()`来观察 actions 及其结果。传递给它的回调函数在 action 本身之前执行。在处理 promises 之后，允许您在 action 解决之后执行函数。类似地，`onError`允许你在 action 抛出或拒绝时执行函数。这些对于在运行时跟踪错误很有用，类似于

[Vue 文档中的这个属性。](https://v3.vuejs.org/guide/tooling/deployment.html#tracking-runtime-errors)

下面是一个在运行 actions 之前和resolve/reject之后记录日志的示例。







```
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



默认情况下，操作订阅被绑定到添加它们的组件（如果 store 在组件的 setup() 中）。这就意味着，当组件被卸载时，它们将被自动删除。如果你想在组件卸载后保留它们，传`true`作为第二个参数，以将操作订阅与当前组件分离：







```
export default {
  setup() {
    const someStore = useSomeStore()

    // this subscription will be kept after the component is unmounted
    someStore.$onAction(callback, true)

    // ...
  },
}
```





# Plugins

由于低版本的API，Pinia 的 stores 可以完全扩展。下面是一些你可以做的事情:

- 向 stores 添加新的属性
- 在定义 stores 时添加新选项
- 向 stores 添加新方法
- 包装现有的方法
- 更改甚至取消操作
- 实现像本地存储这样的副作用
- 只适用于特定的 stores

使用`pinia.use()`将插件添加到pinia实例中。最简单的例子是通过返回一个对象向所有 stores 添加一个静态属性:







```
import { createPinia } from 'pinia'

// add a property named `secret` to every store that is created after this plugin is installed
// this could be in a different file
function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}

const pinia = createPinia()
// give the plugin to pinia
pinia.use(SecretPiniaPlugin)

// in another file
const store = useStore()
store.secret // 'the cake is a lie'
```



这对于添加全局对象（如router、modal 或 toast 管理器）非常有用。

## 介绍

Pinia 的插件是一个函数，可以选择返回要添加到 store 中的属性。它有一个可选参数 context:







```
export function myPiniaPlugin(context) {
  context.pinia // the pinia created with `createPinia()`
  context.app // the current app created with `createApp()` (Vue 3 only)
  context.store // the store the plugin is augmenting
  context.options // the options object defining the store passed to `defineStore()`
  // ...
}
```



然后将此函数传递给 pinia 的`pinia.use()`：







```
pinia.use(myPiniaPlugin)
```



插件只应用于 stores 被创建在 pinia 传递给应用程序后 ，否则它们不会被应用。

## 扩展 Store

你可以通过在插件中返回一个属性对象来为每个 store 添加属性:







```
pinia.use(() => ({ hello: 'world' }))
```



你也可以直接在 store 中设置属性，如果可以的话，请返回版本，以便它们可以被 devtools 自动跟踪：







```
pinia.use(({ store }) => {
  store.hello = 'world'
})
```



插件返回的任何属性都将由 devtools 自动追踪，因此为了 hello 在 devtools 中可见，请确保仅在开发模式中添加 store._customProperties 属性，如果您想在 devtools 中调试的话：







```
// from the example above
pinia.use(({ store }) => {
  store.hello = 'world'
  // make sure your bundler handle this. webpack and vite should do it by default
  if (process.env.NODE_ENV === 'development') {
    // add any keys you set on the store
    store._customProperties.add('hello')
  }
})
```



需要注意的是，每个 store 都会使用[`reactive`](https://v3.vuejs.org/api/basic-reactivity.html#reactive)包装，并且会自动打开它包含的任何 Ref (`ref()`, `computed()`, ...）等：







```
const sharedRef = ref('shared')
pinia.use(({ store }) => {
  // each store has its individual `hello` property
  store.hello = ref('secret')
  // it gets automatically unwrapped
  store.hello // 'secret'

  // all stores are sharing the value `shared` property
  store.shared = sharedRef
  store.shared // 'shared'
})
```



这就是为什么您可以访问所有不带`.value`计算属性它们是响应式的原因。

### 添加新状态

如果您想在 hydration 过程中添加新的状态属性或属性到 store，您必须在两个地方添加它：

- 在`store` 中，您可以通过 store.myState 访问它
- 在`store.$state`中，它可以在 devtools 中被使用，并在 SSR 期间被序列化。

请注意，这允许您共享 ref 或 computed 属性：







```
const globalSecret = ref('secret')
pinia.use(({ store }) => {
  // `secret` is shared among all stores
  store.$state.secret = globalSecret
  store.secret = globalSecret
  // it gets automatically unwrapped
  store.secret // 'secret'

  const hasError = ref(false)
  store.$state.hasError = hasError
  // this one must always be set
  store.hasError = toRef(store.$state, 'hasError')

  // in this case it's better not to return `hasError` since it
  // will be displayed in the `state` section in the devtools
  // anyway and if we return it, devtools will display it twice.
})
```



请注意，在插件中发生的状态改变或添加（包括调用 store.$patch() ）发生在 store 激活之前，因此不会触发任何订阅。

> **WARNING**
> 如果您使用的是 Vue 2，Pinia 将受到与 Vue 相同的反应警告。当创建新的状态属性如 `secret`和`hasError`时，您需要使用来自 @vue/composition-api 的 set 。







```
import { set } from '@vue/composition-api'
pinia.use(({ store }) => {
  if (!store.$state.hasOwnProperty('hello')) {
    const secretRef = ref('secret')
    // If the data is meant to be used during SSR, you should
    // set it on the `$state` property so it is serialized and
    // picked up during hydration
    set(store.$state, 'secret', secretRef)
    // set it directly on the store too so you can access it
    // both ways: `store.$state.secret` / `store.secret`
    set(store, 'secret', secretRef)
    store.secret // 'secret'
  }
})
```



## 添加新的外部属性

当添加外部属性，来自其他库的类实例或简单的非响应式对象时，应该在将对象传递给 `pinia` 之前使用 `markRaw() `包装该对象。下面是一个将路由添加到所有 `store` 的示例:







```
import { markRaw } from 'vue'
// adapt this based on where your router is
import { router } from './router'

pinia.use(({ store }) => {
  store.router = markRaw(router)
})
```



## 在插件内部调用 $subscribe

您也可以在插件中使用 `store.$subscribe` 和 `store.$onAction` ：







```
pinia.use(({ store }) => {
  store.$subscribe(() => {
    // react to store changes
  })
  store.$onAction(() => {
    // react to store actions
  })
})
```



## 添加新选项

可以在定义 `stores` 时创建新的选项，以便随后从插件中使用它们。例如，你可以创建一个`debounce `选项，允许你对任何操作进行 `debounce` :







```
defineStore('search', {
  actions: {
    searchContacts() {
      // ...
    },
  },

  // this will be read by a plugin later on
  debounce: {
    // debounce the action searchContacts by 300ms
    searchContacts: 300,
  },
})
```



插件可以读取该选项来包装 `actions` 并替换原来的 `actions`:







```
// use any debounce library
import debounce from 'lodash/debunce'

pinia.use(({ options, store }) => {
  if (options.debounce) {
    // we are overriding the actions with new ones
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce[action]
      )
      return debouncedActions
    }, {})
  }
})
```



请注意，使用`setup` 语法时，自定义选项作为第三个参数传入：







```
defineStore(
  'search',
  () => {
    // ...
  },
  {
    // this will be read by a plugin later on
    debounce: {
      // debounce the action searchContacts by 300ms
      searchContacts: 300,
    },
  }
)
```



## TypeScript

上面显示的所有内容都可以通过类型判断支持，因此您无需使用 any 或 @ts-ignore 。

### 类型判断插件

Pinia 插件可以按如下方式引入：







```
import { PiniaPluginContext } from 'pinia'

export function myPiniaPlugin(context: PiniaPluginContext) {
  // ...
}
```



### 添加新的store属性

当向`stores `添加新属性时，您还应该扩展 PiniaCustomProperties 接口。







```
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // by using a setter we can allow both strings and refs
    set hello(value: string | Ref<string>)
    get hello(): string

    // you can define simpler values too
    simpleNumber: number
  }
}
```



然后可以安全地写入和读取：







```
pinia.use(({ store }) => {
  store.hello = 'Hola'
  store.hello = ref('Hola')

  store.number = Math.random()
  // @ts-expect-error: we haven't typed this correctly
  store.number = ref(Math.random())
})
```



`PiniaCustomProperties`是一种通用类型，允许您引用`store `的属性。想象以下示例，我们将初始选项复制为 $options（这仅适用于选项 `stores`）：







```
pinia.use(({ options }) => ({ $options: options }))
```



我们可以通过使用`PiniaCustomProperties` 的4 种通用类型来判断正确的类型：







```
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties<Id, S, G, A> {
    $options: {
      id: Id
      state?: () => S
      getters?: G
      actions?: A
    }
  }
}
```



> TIP
>
> 在泛型中扩展类型时，它们的命名必须与源码中的完全相同。
>
> Id 
>
> 不能命名 
>
> id 
>
> 或 
>
> I 
>
> ，
>
> S
>
> 也不能命名 
>
> State
>
> 。以下是每个字母所代表的含义：
>
> - S: State
> - G: Getters
> - A: Actions
> - SS: Setup Store / Store

### 输入新的状态

当添加新的状态属性时(同时添加到`store`和`store.$state`)，您需要将类型添加到`PiniaCustomStateProperties`。与`PiniaCustomProperties`不同的是，它只接收`State`泛型：







```
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomStateProperties<S> {
    hello: string
  }
}
```



### 输入新的创建选项

当为`defineStore()`创建新选项时，您应该扩展`DefineStoreOptionsBase`。与`PiniaCustomProperties`不同的是，它只公开两种泛型：`State`和`Store`类型，允许您限制可以定义的类型。例如，你可以使用`actions`的名称:







```
import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    // allow defining a number of ms for any of the actions
    debounce?: Partial<Record<keyof StoreActions<Store>, number>>
  }
}
```



> TIP
> 还有一个`StoreGetters`类型用于从`Store`类型中提取`getters`。您还可以分别通过`DefineStoreOptions`和`DefineSetupStoreOptions`类型来扩展设置`setup stores`或`option stores`的选项。

## Nuxt.js

当 [Nuxt 和 pinia 一起使用时](https://pinia.vuejs.org/ssr/nuxt.html)，您必须先创建一个 [Nuxt 插件](https://nuxtjs.org/docs/2.x/directory-structure/plugins)。这将使您可以访问该`pinia`实例：







```
// plugins/myPiniaPlugin.js
import { PiniaPluginContext } from 'pinia'
import { Plugin } from '@nuxt/types'

function MyPiniaPlugin({ store }: PiniaPluginContext) {
  store.$subscribe((mutation) => {
    // react to store changes
    console.log(`[🍍 ${mutation.storeId}]: ${mutation.type}.`)
  })

  return { creationTime: new Date() }
}

const myPlugin: Plugin = ({ pinia }) {
  pinia.use(MyPiniaPlugin);
}
export default myPlugin
```



注意上面的例子使用的是`TypeScript`，如果你使用的是`.js`文件，你必须删除`PiniaPluginContext`的类型注释和`Plugin`的引入。



# 在组件之外使用 Store

`Pinia stores`依赖于`Pinia`实例在所有调用中共享相同的`store`实例。大多数情况下，只需调用您的`useStore()`函数，就可以开箱即用了。例如，在`setup()`中，您不需要做任何其他事情。但是在组件之外使用的情况有点不同。在后台，`useStore()`会注入到你应用程序的`pinia`实例中。这意味着，如果`pinia`实例不能被自动注入，你必须手动将它提供给`useStore()`函数。根据所编写的应用程序的类型，可以采用不同的方法来解决这个问题。

## 单页应用程序

如果你不做`SSR`(服务端渲染)，安装`pinia`插件并`app.use(pinia)`后，任何调用`useStore()`方法将起作用：







```
import { useUserStore } from '@/stores/user'
import { createApp } from 'vue'
import App from './App.vue'

// ❌  fails because it's called before the pinia is created
const userStore = useUserStore()

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// ✅ works because the pinia instance is now active
const userStore = useUserStore()
```



确保始终应用此方法的最简单方法是，通过将`useStore()`的调用总是放置在安装`pinia`之后运行的函数中，从而推迟对它们的调用。

让我们来看看这个在`Vue Router`的导航守卫中使用`store`的例子:







```
import { createRouter } from 'vue-router'
const router = createRouter({
  // ...
})

// ❌ Depending on the order of imports this will fail
const store = useStore()

router.beforeEach((to, from, next) => {
  // we wanted to use the store here
  if (store.isLoggedIn) next()
  else next('/login')
})

router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const store = useStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) return '/login'
})
```



## SSR 应用

当处理服务器端渲染时，你必须将`pinia`实例传递给`useStore()`。这将防止`pinia`在不同的应用程序实例之间共享全局状态。

[在SSR 指南中有一个完整的章节，这只是一个简短的解释:](https://pinia.vuejs.org/ssr/)