# 操作指引

# 从 Vuex≤4 迁移

尽管`Vuex`和`Pinia`的`store`结构不同，但许多逻辑可以重用。本指南旨在帮助您完成整个过程，并指出可能出现的一些常见问题。

## 准备

首先，按照[入门指南](https://pinia.vuejs.org/getting-started.html)安装 `Pinia`。

## 将模块重组为Store

Vuex 有个单一`store`包含多模块的的概念。这些模块可以选择使用命名空间，甚至可以相互嵌套。

将这个概念转变为使用`Pinia`，最简单方法是，您以前是使用不同的模块，现在是使用单一的 `store`。每个`store`都必需一个`id`，类似于`Vuex`中的命名空间。这意味着每个`store`都是按设计命名的。嵌套模块也可以各自成为自己的`store`。相互依赖的`store`将被简便地导入到其他`store`。

如何选择将`Vuex`模块重组到`Pinia`的`store`完全取决于您，但这里还有一些建议：

```sh
# Vuex example (assuming namespaced modules)
src
└── store
    ├── index.js           # Initializes Vuex, imports modules
    └── modules
        ├── module1.js     # 'module1' namespace
        └── nested
            ├── index.js   # 'nested' namespace, imports module2 & module3
            ├── module2.js # 'nested/module2' namespace
            └── module3.js # 'nested/module3' namespace

# Pinia equivalent, note ids match previous namespaces
src
└── stores
    ├── index.js          # (Optional) Initializes Pinia, does not import stores
    ├── module1.js        # 'module1' id
    ├── nested-module2.js # 'nested/module3' id
    ├── nested-module3.js # 'nested/module2' id
    └── nested.js         # 'nested' id
```

这为`stores`创建了一个扁平的结构，但也保留了和之前使用`id`等价的命名空间。如果你在`store`的根目录(在`Vuex`的`store/index.js`文件中)中有一些`state/getters/actions/mutations`，你可能希望创建另一个名为`root`的`store`，并且它包含所有这些信息。

`Pinia`的目录通常称为`stores`而不是`store`。这是为了强调`Pinia`使用了多个`store`，而不是`Vuex`中的单一`store`。

对于大型项目，您可能希望逐个模块进行转换，而不是一次性转换所有的内容。实际上，您可以在迁移过程中混合使用`Pinia`和`Vuex`，这种方式也是可行的，这也是命名`Pinia`目录为`stores`的另一个原因。



## 单个模块的转换

这是个将`Vuex`模块转换为`Pinia``store`前后的完整示例，请参阅下面的分步指南。`Pinia`示例使用选项`store`，因为它的结构与`Vuex`最相似：

```typescript
// Vuex module in the 'auth/user' namespace
import { Module } from 'vuex'
import { api } from '@/api'
import { RootState } from '@/types' // if using a Vuex type definition

interface State {
  firstName: string
  lastName: string
  userId: number | null
}

const storeModule: Module<State, RootState> = {
  namespaced: true,
  state: {
    firstName: '',
    lastName: '',
    userId: null
  },
  getters: {
    firstName: (state) => state.firstName,
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // combine with some state from other modules
    fullUserDetails: (state, getters, rootState, rootGetters) => {
      return {
        ...state,
        fullName: getters.fullName,
        // read the state from another module named `auth`
        ...rootState.auth.preferences,
        // read a getter from a namespaced module called `email` nested under `auth`
        ...rootGetters['auth/email'].details
      }
    }
  },
  actions: {
    async loadUser ({ state, commit }, id: number) {
      if (state.userId !== null) throw new Error('Already logged in')
      const res = await api.user.load(id)
      commit('updateUser', res)
    }
  },
  mutations: {
    updateUser (state, payload) {
      state.firstName = payload.firstName
      state.lastName = payload.lastName
      state.userId = payload.userId
    },
    clearUser (state) {
      state.firstName = ''
      state.lastName = ''
      state.userId = null
    }
  }
}

export default storeModule
// Pinia Store
import { defineStore } from 'pinia'
import { useAuthPreferencesStore } from './auth-preferences'
import { useAuthEmailStore } from './auth-email'
import vuexStore from '@/store' // for gradual conversion, see fullUserDetails

interface State {
  firstName: string
  lastName: string
  userId: number | null
}

export const useAuthUserStore = defineStore('auth/user', {
  // convert to a function
  state: (): State => ({
    firstName: '',
    lastName: '',
    userId: null
  }),
  getters: {
    // firstName getter removed, no longer needed
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // must define return type because of using `this`
    fullUserDetails (state): FullUserDetails {
      // import from other stores
      const authPreferencesStore = useAuthPreferencesStore()
      const authEmailStore = useAuthEmailStore()
      return {
        ...state,
        // other getters now on `this`
        fullName: this.fullName,
        ...authPreferencesStore.$state,
        ...authEmailStore.details
      }

      // alternative if other modules are still in Vuex
      // return {
      //   ...state,
      //   fullName: this.fullName,
      //   ...vuexStore.state.auth.preferences,
      //   ...vuexStore.getters['auth/email'].details
      // }
    }
  },
  actions: {
    // no context as first argument, use `this` instead
    async loadUser (id: number) {
      if (this.userId !== null) throw new Error('Already logged in')
      const res = await api.user.load(id)
      this.updateUser(res)
    },
    // mutations can now become actions, instead of `state` as first argument use `this`
    updateUser (payload) {
      this.firstName = payload.firstName
      this.lastName = payload.lastName
      this.userId = payload.userId
    },
    // easily reset state using `$reset`
    clearUser () {
      this.$reset()
    }
  }
})
```

让我们将以上内容分成几个步骤:

1. 为`store`添加一个必需的`id`，您可能希望保持与之前的名称空间相同

2. 如果`state`还不是一个函数，则需将它转换成函数

3. 转换`getters`

4. 1. 删除所有返回相同名称的状态的`getters`(如`firstName:(state) => state.firstName`)这些不是必需的，因为您可以直接从`store`实例访问任何状态
   2. 如果您需要访问其它`getters`，可以使用`this`代替，而不是使用第二个参数。请记住，如果您正在使用`this`，那么您将不得不使用常规函数而不是箭头函数。另外请注意，由于`TS`的限制，您需要返回指定的类型，请参阅[此处](https://pinia.vuejs.org/core-concepts/getters.html#accessing-other-getters)了解更多详细信息
   3. 如果使用`rootState`或`rootGetters`参数，则通过直接导入其他`store`来替换它们，或者如果它们仍然存在于`Vuex`中，则直接从`Vuex`访问它们

5. 转换`actions`

6. 1. 从所有`action`中删除第一个`context`参数，所有东西都应该通过`this`访问
   2. 如果使用其它的`stores`，要么直接导入它们，要么在`Vuex`上访问它们，这与`getters`一样

7. 转换`mutations`

8. 1. `mutations`不再存在。这些可以转换为`actions`，或者您可以直接分配给组件中的`store`(例如：`userStore.firstName = 'First'`)
   2. 如果转换为`actions，`则需删除第一个参数`state`，并用`this`代替所有工作
   3. 一个常见的`mutation`是将状态重置回初始状态。这是`store`中`$reset`方法的内置功能。请注意，此功能仅适用于选项`stores`。

如您所见，您的大部分代码都可以重用。如果遗漏了什么，类型安全还会帮助您确定需要更改什么。



## 组件内使用

现在您的`Vuex`模块已经转换为`Pinia store`，使用该模块的任何组件或其他文件也需要更新。

如果您之前使用过 Vuex 的辅助函数，那么值得看非`setup()`的指南，因为这些辅助函数大多可以重用。

如果您正在使用`useStore`，则直接导入新`store`并访问其上的状态。例如：

```typescript
// Vuex
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup () {
    const store = useStore()

    const firstName = computed(() => store.state.auth.user.firstName)
    const fullName = computed(() => store.getters['auth/user/firstName'])

    return {
      firstName,
      fullName
    }
  }
})
// Pinia
import { defineComponent, computed } from 'vue'
import { useAuthUserStore } from '@/stores/auth-user'

export default defineComponent({
  setup () {
    const authUserStore = useAuthUserStore()

    const firstName = computed(() => authUserStore.firstName)
    const fullName = computed(() => authUserStore.fullName)

    return {
      // you can also access the whole store in your component by returning it
      authUserStore,
      firstName,
      fullName
    }
  }
})
```



## 组件外使用

只要注意不在函数外部使用`store`，更新组件之外的用法都是很简单的。这是在`Vue Router`导航守卫中使用`store`的示例：

```typescript
// Vuex
import vuexStore from '@/store'

router.beforeEach((to, from, next) => {
  if (vuexStore.getters['auth/user/loggedIn']) next()
  else next('/login')
})
/ Pinia
import { useAuthUserStore } from '@/stores/auth-user'

router.beforeEach((to, from, next) => {
  // Must be used within the function!
  const authUserStore = useAuthUserStore()
  if (authUserStore.loggedIn) next()
  else next('/login')
})
```

想了解更多细节可以点击 [这里](https://pinia.vuejs.org/core-concepts/outside-component-usage.html)。



## Vuex 进阶使用

如果您`Vuex`的`store`使用了它提供的一些更高级的功能，下面是一些关于如何在`Pinia `完成相同功能的指南。其中一些要点已收录在 [比较摘要](https://pinia.vuejs.org/introduction.html#comparison-with-vuex-3-x-4-x) 中。

### 动态模块

无需在`Pinia`中动态注册模块。`stores`在设计上是动态的，仅在需要时才注册。如果`store`从没被使用，则永远不会“注册”。

### 热模块更新

`HMR`也受支持，但需要替换，请参阅[`HMR`指南](https://pinia.vuejs.org/cookbook/hot-module-replacement.html)。

### 插件

如果您使用开源的`Vuex`插件，那么检查是否有`Pinia`的替代品。如果没有，您将需要自己编写或评估该插件是否仍然必要。

如果您已经编写了自己的插件，那么很可能需要对其更新，以便能与`Pinia`一起使用。请参阅[插件指南](https://pinia.vuejs.org/core-concepts/plugins.html)。