# 从 0.x (v1) 迁移到 v2

从 2.0.0-rc.4 支持版本开始，`pinia`对`Vue 2`和`Vue 3`都支持！这意味着，所有最新的更新都将应用于`V2`版本，因此`Vue 2`和`Vue 3`用户都能从中受益。如果您使用的是`Vue 3`，这不会为您带来任何改变，因为您已经在使用`rc`，您可以查看[CHANGELOG](https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md)以获取所有更改的详细说明。否则，这篇指南就是为您准备的!



## 弃用的部分

让我们看看需要应用到代码中的所有变更。首先，请确保您已经在运行最新的`0.x`版本以查看弃用的内容：

```sh
npm i 'pinia@^0.x.x'
# or with yarn
yarn add 'pinia@^0.x.x'
```

如果您正在使用`ESLint`，请考虑使用此插件来找到所有已弃用的内容。否则，您应该相互对比查看它们之间相同的内容。下面是那些已弃用并被移除的`API`：

- `createStore()`变成`defineStore()`
- 订阅中的`storeName`变成`storeId`
- `PiniaPlugin`被重命名为`PiniaVuePlugin`(用于`Vue 2`的`Pinia`插件）
- `$subscribe()`不再接受布尔值作为第二个参数，而是通过传递一个对象`detached: true`代替。
- `Pinia`插件不再直接接收`store`的`id`。使用`store.$id`代替。



## 重大的变更

删除这些后，您可以使用以下命令升级到`v2`版本：

```sh
npm i 'pinia@^2.x.x'
# or with yarn
yarn add 'pinia@^2.x.x'
```

并开始更新您的代码。

### Store 泛型

[2.0.0-rc.0中新增](https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md#200-rc0-2021-07-28)

所有该类型的用法已由`StoreGeneric`替换为`GenericStore`。这是新的`store`泛型，它能够接受任何类型的`store`。如果您使用`store`类型编写函数而没传递其泛型（如 `Store<Id, State, Getters, Actions>`），您应该使用`StoreGeneric`作为没有泛型`Store`的类型，并创建一个空的`store`类型。

```sh
-function takeAnyStore(store: Store) {}
+function takeAnyStore(store: StoreGeneric) {}

-function takeAnyStore(store: GenericStore) {}
+function takeAnyStore(store: StoreGeneric) {}
```



## 专为插件的  DefineStoreOptions

如果您正在使用`TypeScript`编写插件，并扩展`DefineStoreOptions`类型以添加自定义选项，您应将其重命名为`DefineStoreOptionsBase`。此类型在`setup`和`options stores`都适用。

```sh
declare module 'pinia' {
-  export interface DefineStoreOptions<S, Store> {
+  export interface DefineStoreOptionsBase<S, Store> {
     debounce?: {
       [k in keyof StoreActions<Store>]?: number
     }
   }
 }
```



## PiniaStorePlugin  被重命名

类型`PiniaStorePlugin`已重命名为`PiniaPlugin`。

```sh
-import { PiniaStorePlugin } from 'pinia'
+import { PiniaPlugin } from 'pinia'

-const piniaPlugin: PiniaStorePlugin = () => {
+const piniaPlugin: PiniaPlugin = () => {
   // ...
 }
```

请注意，此变更能生效的前提是，将`Pinia`升级到最新版本。



## @vue/composition-api 版本

由于`pinia`依赖于`effectScope()`，因此您使用`@vue/composition-api`的版本至少为 `1.1.0`：

```sh
npm i @vue/composition-api@latest
# or with yarn
yarn add @vue/composition-api@latest
```



## webpack 4 支持

如果您使用的是`webpack 4`（`Vue CLI`使用`webpack 4`），您可能会遇到如下错误：

```sh
ERROR  Failed to compile with 18 errors

 error  in ./node_modules/pinia/dist/pinia.mjs

Can't import the named export 'computed' from non EcmaScript module (only default export is available)
```

这是由于`dist`文件的现代化以支持`Node.js`中的原生`ESM`模块。文件使用`.mjs`和`.cjs`扩展名来让`Node`从中受益。要解决此问题，您有两种可能：

- 如果您使用的是`Vue CLI 4.x`，请升级您的依赖项。这应该包括下面的修复。

- - 如果您无法升级，请将其添加到您的`vue.config.js`：

```js
// vue.config.js
module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
  },
}
```

- 如果您手动处理`webpack`，您必须让它知道如何处理`.mjs`文件：

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ],
  },
}
```



## 开发工具

`Pinia v2`不再支持`Vue Devtools v5`，它需要`Vue Devtools v6`。[在Vue Devtools 文档](https://devtools.vuejs.org/guide/installation.html#chrome)中找到该扩展`beta`通道的下载链接。



## Nuxt

如果您使用`Nuxt`，`pinia`现在有它的专有`Nuxt`包🎉。安装它：

```sh
npm i @pinia/nuxt
# or with yarn
yarn add @pinia/nuxt
```

还要确保更新您的**`@nuxtjs/composition-api`**包。

如果您使用的是`TypeScript `，请调整您`nuxt.config.js`和`tsconfig.json`的配置：

```js
 // nuxt.config.js
 module.exports {
   buildModules: [
     '@nuxtjs/composition-api/module',
-    'pinia/nuxt',
+    '@pinia/nuxt',
   ],
 }
```

```json
 // tsconfig.json
 {
   "types": [
     // ...
-    "pinia/nuxt/types"
+    "@pinia/nuxt"
   ]
 }
```

还建议您阅读`Nuxt`专用章节。

