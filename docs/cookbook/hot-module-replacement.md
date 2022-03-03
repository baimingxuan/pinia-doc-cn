# HMR (热模块更新)

`Pinia`支持热模块更新，因此您可以直接在您的应用程序中修改您的`stores`并与它们进行交互，而无需重新加载页面，从而允许您保留现有的状态，添加，甚至删除`state`，`actions`，和`getters`。

目前，官方只支持[Vite](https://cn.vitejs.dev/)，但任何执行`import.meta.hot`规范的打包器都应该能生效（[webpack](https://webpack.docschina.org/api/module-variables#importmetawebpackHot)似乎使用`import.meta.webpackHot`而不是`import.meta.hot`）。您需要在任何`store`声明旁边添加这段代码。假设您有三个`stores`：`auth.js`, `cart.js`, 和`chat.js`, 您必须在创建`store`定义后添加（并调整）它：

```js
// auth.js
import { defineStore, acceptHMRUpdate } from 'pinia'

const useAuth = defineStore('auth', {
  // options...
})

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
```