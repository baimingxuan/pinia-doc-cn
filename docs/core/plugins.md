# Plugins

由于低版本的`API`，`Pinia`的`stores`可以完全扩展。下面是一些你可以做的事情:

- 向`stores`添加新的属性
- 在定义`stores`时添加新选项
- 向`stores`添加新方法
- 包装现有的方法
- 更改甚至取消操作
- 实现像本地存储这样的功能
- 只适用于特定的`stores`

使用`pinia.use()`将插件添加到`pinia`实例中。最简单的例子是通过返回一个对象向所有`stores` 添加一个静态属性:

```js
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

这对于添加全局对象（如`router`、`modal`或`toast`管理器）非常有用。



## 介绍

`Pinia`的插件是一个函数，可以选择返回要添加到`store`中的属性。它有一个可选参数 `context`:

```js
export function myPiniaPlugin(context) {
  context.pinia // the pinia created with `createPinia()`
  context.app // the current app created with `createApp()` (Vue 3 only)
  context.store // the store the plugin is augmenting
  context.options // the options object defining the store passed to `defineStore()`
  // ...
}
```

然后将此函数传递给`pinia`的`pinia.use()`：

```js
pinia.use(myPiniaPlugin)
```

插件只应用于`stores`被创建在`pinia`传递给应用程序后 ，否则它们不会被应用。



## 扩展 Store

你可以通过在插件中返回一个属性对象来为每个`store`添加属性:

```js
pinia.use(() => ({ hello: 'world' }))
```

你也可以直接在`store`中设置属性，如果可以的话，请返回版本，以便它们可以被`devtools`自动跟踪：

```js
pinia.use(({ store }) => {
  store.hello = 'world'
})
```

插件返回的任何属性都将由`devtools`自动追踪，因此为了`hello`在`devtools`中可见，请确保仅在开发模式中添加`store._customProperties`属性，如果您想在`devtools`中调试的话：

```js
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

需要注意的是，每个`store`都会使用[`reactive`](https://v3.vuejs.org/api/basic-reactivity.html#reactive)包装，并且会自动解包它包含的任何`Ref`(`ref()`, `computed()`, ...）等：

```js
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

如果您想在注水过程中添加新的状态属性或属性到`store`，您必须在两个地方添加它：

- 在`store`中，您可以通过`store.myState`访问它
- 在`store.$state`中，它可以在`devtools`中使用，并且在`SSR`期间被序列化。

请注意，这允许您共享`ref`或`computed`属性：

```js
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

请注意，在插件中发生的状态改变或添加（包括调用`store.$patch()`）发生在`store`激活之前，因此不会触发任何订阅。

> **WARNING**
> 如果您使用的是`Vue 2`，`Pinia`将受到与`Vue`相同的反应警告。当创建新的状态属性如 `secret`和`hasError`时，您需要使用来自`@vue/composition-api`的`set`方法。

```js
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

当添加外部属性，来自其他库的类实例或简单的非响应式对象时，应该在将对象传递给`pinia` 之前使用`markRaw()`包装该对象。下面是一个将路由添加到所有`store`的示例:

```js
import { markRaw } from 'vue'
// adapt this based on where your router is
import { router } from './router'

pinia.use(({ store }) => {
  store.router = markRaw(router)
})
```



## 在插件内部调用 $subscribe

您也可以在插件中使用`store.$subscribe`和`store.$onAction`：

```ts
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

可以在定义`stores`时创建新的选项，以便随后从插件中使用它们。例如，你可以创建一个`debounce`选项，允许你对任何操作进行`debounce` :

```js
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

插件可以读取该选项来包装`actions`并替换原来的`actions`:

```js
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

请注意，使用`setup`语法时，自定义选项作为第三个参数传入：

```js
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

上面显示的所有内容都可以通过编写支持，因此您无需使用`any`或`@ts-ignore`。

### 编写插件

`Pinia`插件可以按如下方式编写：

```ts
import { PiniaPluginContext } from 'pinia'

export function myPiniaPlugin(context: PiniaPluginContext) {
  // ...
}
```

### 编写新的store属性

当向`stores`添加新属性时，您还应该扩展`PiniaCustomProperties`接口。

```ts
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

```ts
pinia.use(({ store }) => {
  store.hello = 'Hola'
  store.hello = ref('Hola')

  store.number = Math.random()
  // @ts-expect-error: we haven't typed this correctly
  store.number = ref(Math.random())
})
```

`PiniaCustomProperties`是一个泛型类型，允许您引用`store`的属性。想象一下下面的示例，我们将初始选项复制为`$options`（这仅适用于`option stores`）：

```ts
pinia.use(({ options }) => ({ $options: options }))
```

我们可以通过使用`PiniaCustomProperties`的4个泛型类型来正确地输入这个值:

```ts
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
> 在泛型中扩展类型时，它们的命名必须与源码中的完全相同。`Id`不能命名为`id`或`I`，`S`也不能命名为`State`。以下是每个字母所代表的含义：
>
> - S: State
> - G: Getters
> - A: Actions
> - SS: Setup Store / Store

### 编写新的状态

当添加新的状态属性时(同时添加到`store`和`store.$state`)，您需要将类型添加到`PiniaCustomStateProperties`。与`PiniaCustomProperties`不同的是，它只接收`State`泛型：

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomStateProperties<S> {
    hello: string
  }
}
```

### 编写新的创建选项

当为`defineStore()`创建新选项时，您应该扩展`DefineStoreOptionsBase`。与`PiniaCustomProperties`不同的是，它只公开两种泛型：`State`和`Store`类型，允许您限制可以定义的类型。例如，你可以使用`actions`的名称:

```ts
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

当`Nuxt`和`Pinia`一起使用时，您必须先创建一个[`Nuxt`插件](https://nuxtjs.org/docs/2.x/directory-structure/plugins)。这将使您可以访问该`Pinia`实例：

```ts
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