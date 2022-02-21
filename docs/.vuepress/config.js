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
                path: '/introduction/Introduction',
                collapsable: false,
                children: [
                    {
                        title: 'Pinia是什么？',
                        path: '/introduction/Introduction'
                    },
                    {
                        title: '快速上手',
                        path: '/introduction/Installation'
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
            }
        ]
    }
}
