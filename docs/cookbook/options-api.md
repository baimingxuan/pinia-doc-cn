# 不使用 setup()

即使不使用`Composition API`，也可以使用`Pinia`(如果您使用的是`Vue 2`，就需要安装`@vue/composition-api`插件)。虽然我们建议您尝试使用`Composition API`或者学习它，但现在对于您和您的团队可能还不是时候，您可能正在迁移应用程序的过程中，或者出于其他原因。这儿有几个可能帮到你函数:

- [mapStores](https://pinia.vuejs.org/cookbook/options-api.html#giving-access-to-the-whole-store)
- [mapState](https://pinia.vuejs.org/core-concepts/state.html#options-api)
- [mapWritableState](https://pinia.vuejs.org/core-concepts/state.html#modifiable-state)
- ⚠️ [mapGetters](https://pinia.vuejs.org/core-concepts/getters.html#options-api) (只是为了迁移方便, 用`mapState()`替代)
- [mapActions](https://pinia.vuejs.org/core-concepts/actions.html#options-api)

## 获取整个 store 的访问权限

如果你需要访问`store`中几乎所有的内容，那么对于`store`的每个属性都需要做映射......相反，你可以通过`mapStores()`访问整个`store`：

```js
import { mapStores } from 'pinia'

// given two stores with the following ids
const useUserStore = defineStore('user', {
  // ...
})
const useCartStore = defineStore('cart', {
  // ...
})

export default {
  computed: {
    // note we are not passing an array, just one store after the other
    // each store will be accessible as its id + 'Store'
    ...mapStores(useCartStore, useUserStore),
    }),
  },

  methods: {
    async buyStuff() {
      // use them anywhere!
      if (this.userStore.isAuthenticated()) {
        await this.cartStore.buy()
        this.$router.push('/purchased')
      }
    },
  },
}
```

默认情况下，`Pania`将为所有`store`的`id`添加`"Store"`后缀。您也可以通过调用`setMapStoreSuffix()`来自定义：

```js
import { createPinia, setMapStoreSuffix } from 'pinia'

// completely remove the suffix: this.user, this.cart
setMapStoreSuffix('')
// this.user_store, this.cart_store (it's okay, I won't judge you)
setMapStoreSuffix('_store')
export const pinia = createPinia()
```

## TypeScript

默认情况下，所有的辅助函数都提供自动补全的功能，因此你不需要做任何事情。

如果您调用`setMapStoreSuffix()`更改`"Store"`后缀，您还需要将其添加到`TS`文件或`global.d.ts`文件中的某个地方。最方便的地方是您调用`setMapStoreSuffix()`的地方：

```typescript
import { createPinia, setMapStoreSuffix } from 'pinia'

setMapStoreSuffix('') // completely remove the suffix
export const pinia = createPinia()

declare module 'pinia' {
  export interface MapStoresCustomization {
    // set it to the same value as above
    suffix: ''
  }
}
```

WARNING

如果您使用`TypeScript`声明文件（如`global.d.ts`），请确保在它的头部引入`'pinia'`来公开所有现有的类型。