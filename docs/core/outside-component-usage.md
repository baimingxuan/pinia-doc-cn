# 在组件之外使用 Store

`Pinia stores`依赖于`Pinia`实例在所有调用中共享相同的`store`实例。大多数情况下，只需调用您的`useStore()`函数，就可以开箱即用了。例如，在`setup()`中，您不需要做任何其他事情。但是在组件之外使用的情况有点不同。在后台，`useStore()`会注入到你应用程序的`pinia`实例中。这意味着，如果`pinia`实例不能被自动注入，你必须手动将它提供给`useStore()`函数。根据所编写的应用程序的类型，可以采用不同的方法来解决这个问题。



## 单页应用程序

如果你不做`SSR`(服务端渲染)，安装`pinia`插件并`app.use(pinia)`后，任何调用`useStore()`方法将起作用：

```js
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

让我们来看看这个在`Vue Router`的导航守卫中使用`store`的示例:

```js
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

在[SSR指南](https://baimingxuan.net/pinia-doc-cn/ssr/vue-and-vite.html)中有一个完整的章节，这只是一个简短的解释。