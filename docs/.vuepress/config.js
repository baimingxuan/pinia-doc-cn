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
                path: '/core/defined',
                collapsable: false,
                children: [
                    {
                        title: '定义Store',
                        path: '/core/defined'
                    },
                    {
                        title: 'State',
                        path: '/core/State'
                    },
                    {
                        title: 'Getters',
                        path: '/core/Getters'
                    },
                    {
                        title: 'Actions',
                        path: '/core/Actions'
                    },
                    {
                        title: 'Plugins',
                        path: '/core/Plugins'
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
