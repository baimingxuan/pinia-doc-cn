# 测试 stores

按照设计，`stores`将在许多地方被使用，并且会使测试变得比应有的困难得多。

幸运的是，事实并非如此。在测试`stores`时，我们需要注意以下三点：

- `pinia`实例：没有它，`stores`就无法运作
- `actions`：大多数时候，它们包含了`stores`最复杂的逻辑。如果他们默认被模拟不是很好吗？
- `Plugins`：如果您依赖于插件，您也必须安装它们并进行测试

根据您测试的内容或方式，我们需要以不同的方式处理这三个问题：

- 单元测试`stores`（组件外）
- 使用`stores`单元测试组件
- 端到端测试

## 对 store 进行单元测试

要对`store`进行单元测试，最重要的部分是创建`pinia`实例：

```js
// counterStore.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useCounter } from '../src/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('increments', () => {
    const counter = useCounter()
    expect(counter.n).toBe(0)
    counter.increment()
    expect(counter.n).toBe(1)
  })

  it('increments by amount', () => {
    const counter = useCounter()
    counter.increment(10)
    expect(counter.n).toBe(10)
  })
})
```

如果您有使用`store`插件，有一件重要的事情要知道：在应用安装`pinia`之前，插件不会被使用。可以通过创建一个空应用或假应用来解决：

```
import { setActivePinia, createPinia } from 'pinia'
import { createApp } from 'vue'
import { somePlugin } from '../src/stores/plugin'

// same code as above...

// you don't need to create one app per test
const app = createApp({})
beforeEach(() => {
  const pinia = createPinia().use(somePlugin)
  app.use(pinia)
  setActivePinia(pinia)
})
```



## 对组件进行单元测试

可以通过 `createTestingPinia() `实现。我还没有为它编写合适的文档，但是可以通过自动补全和出现在工具提示中的文档来理解它的用法。

从安装`@pinia/testing`开始：

```sh
npm i -D @pinia/testing
```

当组件挂载时，请确保在测试中创建一个测试`pinia`：

```js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia()],
  },
})

const store = useSomeStore() // uses the testing pinia!

// state can be directly manipulated
store.name = 'my new name'
// can also be done through patch
store.$patch({ name: 'new name' })
expect(store.name).toBe('new name')

// actions are stubbed by default but can be configured by
// passing an option to `createTestingPinia()`
store.someAction()

expect(store.someAction).toHaveBeenCalledTimes(1)
expect(store.someAction).toHaveBeenLastCalledWith()
```

[您可以在测试包的测试中](https://github.com/vuejs/pinia/blob/v2/packages/testing/src/testing.spec.ts)找到更多示例。

## E2E 测试

`对于``pinia`，您无需为`e2e`测试更改任何东西，这是`e2e`测试最重要的点！您也许可以测试`HTTP`请求，但这已经超出了本指南的范围😄。