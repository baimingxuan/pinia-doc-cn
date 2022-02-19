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