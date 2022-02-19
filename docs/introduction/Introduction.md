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

Pinia 初是为了探索 Vuex 的下一次迭代会是什么样子，整合了核心团队关于 Vuex 5 的许多想法。最终，我们意识到 Pinia 已经实现了我们在 Vuex 5 中想要的大部分内容，并决定实现它取而代之的一种思考。

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

