module.exports = {
    title: 'Pinia 中文文档',
    description: 'Pinia 中文文档(详细翻译官方文档)',
    themeConfig: {
        nav: [
            {
                text: 'GitHub',
                link: 'https://github.com/baimingxuan/pinia-doc-cn'
            }
        ],
        sidebar: [
            {
                title: '介绍',
                path: '/guide/introduction',
                collapsable: false,
                children: [
                    {
                        title: 'Pinia是什么？',
                        path: '/guide/introduction'
                    },
                    {
                        title: '快速上手',
                        path: '/guide/getting-started'
                    }
                ]
            },
            {
                title: '核心概念',
                path: '/core/defining-store',
                collapsable: false,
                children: [
                    {
                        title: '定义Store',
                        path: '/core/defining-store'
                    },
                    {
                        title: 'State',
                        path: '/core/state'
                    },
                    {
                        title: 'Getters',
                        path: '/core/getters'
                    },
                    {
                        title: 'Actions',
                        path: '/core/actions'
                    },
                    {
                        title: 'Plugins',
                        path: '/core/plugins'
                    },
                    {
                        title: '组件外使用Store',
                        path: '/core/outside-component-usage'
                    }
                ]
            },
            {
                title: '服务端渲染（SSR）',
                path: '/ssr/vue',
                collapsable: false,
                children: [
                    {
                        title: 'Vue和Vite',
                        path: '/ssr/vue'
                    },
                    {
                        title: 'Next',
                        path: '/ssr/next'
                    }
                ]
            }
        ]
    }
}
