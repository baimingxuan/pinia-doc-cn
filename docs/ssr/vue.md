# 服务端渲染 (SSR)

> TIP
>
> 如果您使用的是Nuxt.js，则需要阅读[这些说明](https://pinia.vuejs.org/ssr/nuxt.html)。

使用`Pinia`创建`stores`对于`SSR`来说应该是开箱即用的，只要你在`setup`函数，`getters`和`actions`的顶部调用你的`useStore()`函数:

```js
export default defineComponent({
  setup() {
    // this works because pinia knows what application is running inside of
    // `setup()`
    const main = useMainStore()
    return { main }
  },
})
```



## 不在setup()中使用store

如果你需要在其他地方使用`store`，则需要将传递给应用程序`pinia`的实例传递给`useStore()`函数调用:

```js
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

router.beforeEach((to) => {
  // ✅ This will work make sure the correct store is used for the
  // current running app
  const main = useMainStore(pinia)

  if (to.meta.requiresAuth && !main.isLoggedIn) return '/login'
})
```

`Pinia`方便地将自己作为`$Pinia`添加到你的应用程序中，因此您可以在像`serverPrefetch()`这样的函数中使用它:

```js
export default {
  serverPrefetch() {
    const store = useStore(this.$pinia)
  },
}
```



## 状态注水

为了注水初始状态，您需要确保在`HTML`的某个地方包含了`rootState`，以便`Pinia`以后可以获取它。根据您用于`SSR`的内容，出于安全原因，您应该转义该状态。我们建议使用`Nuxt.js` 的 [@nuxt/devalue](https://github.com/nuxt-contrib/devalue) 插件：

```js
import devalue from '@nuxt/devalue'
import { createPinia } from 'pinia'
// retrieve the rootState server side
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

// after rendering the page, the root state is build and can be read directly
// on `pinia.state.value`.

// serialize, escape (VERY important if the content of the state can be changed
// by the user, which is almost always the case), and place it somewhere on
// the page, for example, as a global variable.
devalue(pinia.state.value)
```

根据您`SSR`使用的内容，您将设置一个将在`HTML`序列化的初始状态变量。您还应该保护自己免受`XSS`攻击。例如，使用[`vite-ssr`](https://github.com/frandiox/vite-ssr)库您就可以使用[`transformState`](https://github.com/frandiox/vite-ssr#state-serialization)方法和`@nuxt/devalue`插件：

```js
import devalue from '@nuxt/devalue'

export default viteSSR(
  App,
  {
    routes,
    transformState(state) {
      return import.meta.env.SSR ? devalue(state) : state
    },
  },
  ({ initialState }) => {
    // ...
    if (import.meta.env.SSR) {
      // this will be stringified and set to window.__INITIAL_STATE__
      initialState.pinia = pinia.state.value
    } else {
      // on the client side, we restore the state
      pinia.state.value = initialState.pinia
    }
  }
)
```

您可以根据需要，使用其他替代`@nuxt/devalue`的方法，例如，如果您可以使用`JSON.stringify()`/`JSON.parse()`序列化和解析您的状态，则可以大大提高您的性能。

让这个策略适应您的环境。在客户端调用任何`useStore()`函数之前，请确保`pinia`的状态注水。例如，如果我们将状态序列化为一个`<script>`标签，并使其可以在客户端通过`window.__pinia`全局访问，我们可以这样写：

```js
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// must be set by the user
if (isClient) {
  pinia.state.value = JSON.parse(window.__pinia)
}
```