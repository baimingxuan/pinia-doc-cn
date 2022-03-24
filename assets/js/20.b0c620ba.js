(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{416:function(t,a,n){"use strict";n.r(a);var s=n(56),e=Object(s.a)({},(function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("h2",{attrs:{id:"安装"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#安装"}},[t._v("#")]),t._v(" 安装")]),t._v(" "),n("p",[t._v("使用您最喜欢的包管理工具安装"),n("code",[t._v("Pinia")]),t._v("：")]),t._v(" "),n("div",{staticClass:"language-sh extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[n("span",{pre:!0,attrs:{class:"token function"}},[t._v("yarn")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("add")]),t._v(" pinia\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# or with npm")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" pinia\n")])])]),n("blockquote",[n("p",[t._v("TIP\n如果您的应用使用的是"),n("code",[t._v("Vue 2")]),t._v("，你还需要安装 "),n("code",[t._v("composition api")]),t._v(": "),n("code",[t._v("@vue/composite-api")]),t._v("。如果您正在使用"),n("code",[t._v("Nuxt")]),t._v("，也应遵循"),n("a",{attrs:{href:"https://baimingxuan.net/pinia-doc-cn/ssr/nuxt.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("这些说明"),n("OutboundLink")],1),t._v("。")])]),t._v(" "),n("p",[t._v("如果你使用的是"),n("code",[t._v("Vue CLI")]),t._v("，你可以试试这个"),n("a",{attrs:{href:"https://github.com/wobsoriano/vue-cli-plugin-pinia",target:"_blank",rel:"noopener noreferrer"}},[t._v("非官方的插件"),n("OutboundLink")],1),t._v("。")]),t._v(" "),n("p",[t._v("创建一个"),n("code",[t._v("pinia")]),t._v("(根"),n("code",[t._v("store")]),t._v(")并将其传递给应用程序：")]),t._v(" "),n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" createPinia "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'pinia'")]),t._v("\n\napp"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("use")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("createPinia")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),n("p",[t._v("如果您使用的是"),n("code",[t._v("Vue 2")]),t._v("，您还需要安装一个插件，并将创建的"),n("code",[t._v("pinia")]),t._v("注入到应用程序的根目录:")]),t._v(" "),n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" createPinia"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" PiniaVuePlugin "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'pinia'")]),t._v("\n\nVue"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("use")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("PiniaVuePlugin"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" pinia "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("createPinia")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Vue")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("el")]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'#app'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// other options...")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// note the same `pinia` instance can be used across multiple Vue apps on")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// the same page")]),t._v("\n  pinia"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),n("p",[t._v("这也将增加"),n("code",[t._v("devtools")]),t._v("支持。在"),n("code",[t._v("Vue 3")]),t._v("中，像时间旅行和编辑这样的功能仍然不被支持，因为"),n("code",[t._v("vue-devtools")]),t._v("尚未公开必要的 "),n("code",[t._v("api")]),t._v("，但"),n("code",[t._v("devtools")]),t._v("具有更多的功能，总体来说，开发人员的体验要优越得多。在"),n("code",[t._v("Vue 2")]),t._v("中，"),n("code",[t._v("Pinia")]),t._v("使用了"),n("code",[t._v("Vuex")]),t._v("的现有接口(因此不能与"),n("code",[t._v("Vuex")]),t._v("一起使用)。")]),t._v(" "),n("h2",{attrs:{id:"什么是store"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#什么是store"}},[t._v("#")]),t._v(" 什么是Store？")]),t._v(" "),n("p",[n("code",[t._v("Store")]),t._v("(如"),n("code",[t._v("Pinia")]),t._v(")是保存状态和业务逻辑的实体，它没有绑定到组件树。换句话说，它承载全局状态。它有点像一个总是存在的组件，每个人都可以读取和写入。它有三个核心概念，"),n("a",{attrs:{href:"https://baimingxuan.net/pinia-doc-cn/core/state.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("state"),n("OutboundLink")],1),t._v("、"),n("a",{attrs:{href:"https://baimingxuan.net/pinia-doc-cn/core/getters.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("getters"),n("OutboundLink")],1),t._v(" 和 "),n("a",{attrs:{href:"https://baimingxuan.net/pinia-doc-cn/core/actions.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("actions"),n("OutboundLink")],1),t._v("，可以想当然地认为这些概念等同于组件中的"),n("code",[t._v("data")]),t._v("、"),n("code",[t._v("computed")]),t._v(" 和"),n("code",[t._v("methods")]),t._v("。")]),t._v(" "),n("h2",{attrs:{id:"什么时候应该使用store"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#什么时候应该使用store"}},[t._v("#")]),t._v(" 什么时候应该使用Store")]),t._v(" "),n("p",[n("code",[t._v("Store")]),t._v("应该包含可以在整个应用程序中访问的数据。这包括在很多地方使用的数据，例如在导航栏中显示的用户信息，以及需要通过页面保存的数据，例如非常复杂的多步骤表单。")]),t._v(" "),n("p",[t._v("另一方面，你应该避免在"),n("code",[t._v("store")]),t._v("中包含可能托管在组件中的本地数据，例如，页面本地元素的可见性。")]),t._v(" "),n("p",[t._v("并不是所有的应用程序都需要访问全局状态，但是如果您需要，"),n("code",[t._v("Pinia")]),t._v("将使您的工作更轻松。")])])}),[],!1,null,null,null);a.default=e.exports}}]);