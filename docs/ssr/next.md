# Nuxt.js

`Pinia`与`Nuxt.js`一起使用是更容易的，因为`Nuxt`在服务器端渲染方面处理了很多事情。例如，您不需要关心序列化或`XSS`攻击的问题。

## 安装

请确保`pinia`和[`@nuxtjs/composition-api`](https://composition-api.nuxtjs.org/)一起安装：

```sh
yarn add pinia @pinia/nuxt @nuxtjs/composition-api
# or with npm
npm install pinia @pinia/nuxt @nuxtjs/composition-api
```

我们提供了一个模块来为您处理所有事情，您只需在`nuxt.config.js`文件中将其添加到`buildModules`模块中：

```js
// nuxt.config.js
export default {
  // ... other options
  buildModules: [
    // Nuxt 2 only:
    // https://composition-api.nuxtjs.org/getting-started/setup#quick-start
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt',
  ],
}
```

就是这样，像往常一样使用您的`store`！

## 不在setup()中使用store

如果您不想在`setup()`中使用`store`，请记住将`pinia`对象传递给`useStore()`。我们将它添加到上下文中，这样你就可以在`asyncData()`和`fetch()`中访问它:

```js
import { useStore } from '~/stores/myStore'

export default {
  asyncData({ $pinia }) {
    const store = useStore($pinia)
  },
}
```

## 在stores中使用Nuxt上下文

通过使用注入的`$nuxt`属性，你也可以在任何`store`中使用上下文：

```js
import { useUserStore } from '~/stores/userStore'

defineStore('cart', {
  actions: {
    purchase() {
      const user = useUserStore()
      if (!user.isAuthenticated()) {
        this.$nuxt.redirect('/login')
      }
    },
  },
})
```



## 将 Pinia 与 Vuex 一起使用

建议避免同时使用`Pinia`和`Vuex`，但如果您需要同时使用，您需要告诉`Pinia`不要禁用它:

```js
// nuxt.config.js
export default {
  buildModules: [
    '@nuxtjs/composition-api/module',
    ['@pinia/nuxt', { disableVuex: false }],
  ],
  // ... other options
}
```



## TypeScript

如果您使用的是`TypeScript`或`jsconfig.json`，您还应该添加`context.pinia`的类型:

```json
{
  "types": [
    // ...
    "@pinia/nuxt"
  ]
}
```

这也将确保您具有自动补全功能😉。