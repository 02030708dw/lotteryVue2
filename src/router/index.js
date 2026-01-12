import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// Vue.prototype.$routerReplace =

//         beforeEnter: (to, from, next) => {
//             const data = {roomMasterId: 1, userId: 1}
//             Api(to, from, next, API.REPORT, data, '盈虧查詢')
//         }

// component: () => import(/* webpackChunkName: "GuideStyle" */ '@V/GuideStyle')
let route = {
    mode: 'history',
    routes: [
        { path: '*', redirect: '/' },
        {
            path: '/',
            name: 'Home',
            meta: {
                title: ''
            },
            component: r => require.ensure([], () => r(require('@V/Home')), 'Home')
        },
        // {
        //     path: '/MyFavorites',
        //     name: 'MyFavorites',
        //     meta: {
        //         // '我的最爱'
        //         title: 'home_041'
        //     },
        //     component: r => require.ensure([], () => r(require('@V/MyFavorites')), 'MyFavorites')
        // },
        {
            path: '/GamePlayerVN',
            name: 'GamePlayerVN',
            meta: {
                // 游戏页
                title: 'home_023'
            },
            component: r => require.ensure([], () => r(require('@V/GamePlayerVN')), 'GamePlayerVN')
        },
        {
            path: '/GamePlayerTH/:lottery',
            name: 'GamePlayerTH',
            meta: {
                // 游戏页
                title: 'home_023'
            },
            component: r => require.ensure([], () => r(require('@V/GamePlayerTH')), 'GamePlayerTH')
        },
        {
            path: '/GamePlayerStock/:lottery',
            name: 'GamePlayerStock',
            meta: {
                // 游戏页
                title: 'home_023'
            },
            component: r => require.ensure([], () => r(require('@V/GamePlayerStock')), 'GamePlayerStock')
        },
        {
            path: '/GamePlayerTable/:lottery',
            name: 'GamePlayerTable',
            meta: {
                // 游戏页
                title: 'home_023'
            },
            component: r => require.ensure([], () => r(require('@V/GamePlayerTable')), 'GamePlayerTable')
        },
        {
            path: '/GamePlayerLA/:lottery',
            name: 'GamePlayerLA',
            meta: {
                // 游戏页
                title: 'home_023'
            },
            component: r => require.ensure([], () => r(require('@V/GamePlayerLA')), 'GamePlayerLA')
        },
        {
            path: '/GamePlayerMY/:lottery',
            name: 'GamePlayerMY',
            meta: {
                // 游戏页
                title: 'home_023'
            },
            component: r => require.ensure([], () => r(require('@V/GamePlayerMY')), 'GamePlayerMY')
        },
        // {
        //     path: '/AddNewGameInfoDetails/:taskId',
        //     name: 'AddNewGameInfoShowDetail',
        //     meta: {
        //         // 追号记录-详细
        //         title: ''
        //     },
        //     component: r => require.ensure([], () => r(require('@V/AddNewGameInfoDetails')), 'AddNewGameInfoDetails')
        // },
        // {
        //     path: '/AddNewGameInfo',
        //     name: 'AddNewGameInfo',
        //     meta: {
        //         // 追号记录
        //         title: 'home_010'
        //     },
        //     component: r => require.ensure([], () => r(require('@V/AddNewGameInfo')), 'AddNewGameInfo'),
        //     children: [
        //         {
        //             name: 'AddNewGameInfo-search',
        //             path: ':search',
        //             component: r => require.ensure([], () => r(require('@V/AddNewGameInfo')), 'AddNewGameInfo')
        //         }
        //     ]
        // },
        {
            path: '/GameInfo',
            name: 'GameInfo',
            meta: {
                // 投注记录
                title: 'home_009'
            },
            component: r => require.ensure([], () => r(require('@V/GameInfo')), 'GameInfo'),
            children: [
                {
                    name: 'GameInfo-search',
                    path: ':search',
                    component: r => require.ensure([], () => r(require('@V/GameInfo')), 'GameInfo')
                }
            ]
        },
        {
            path: '/ReportList',
            name: 'ReportList',
            meta: {
                // 盈亏查询
                title: 'home_011'
            },
            component: r => require.ensure([], () => r(require('@V/ReportList')), 'ReportList')
        },
        // {
        //     path: '/PlayInfo',
        //     name: 'PlayInfo',
        //     meta: {
        //         title: '玩法说明'
        //     },
        //     component: r => require.ensure([], () => r(require('@V/PlayInfo')), 'PlayInfo')
        // },
        {
            path: '/PlayInfo/:menuId',
            name: 'PlayInfo',
            meta: {
                // 玩法说明
                title: 'home_013'
            },
            component: r => require.ensure([], () => r(require('@V/PlayInfoNew')), 'PlayInfoNew'),
            children: [
                {
                    path: ':lotName',
                    name: 'PlayInfoLot',
                    meta: {
                        // 玩法说明
                        title: 'home_013'
                    },
                    component: r => require.ensure([], () => r(require('@V/PlayInfoNew')), 'PlayInfoNew')
                }
            ]
        },
        // {
        //     path: '/APPQRCode',
        //     name: 'APPQRCode',
        //     meta: {
        //         // 手机APP
        //         title: 'home_015'
        //     },
        //     component: r => require.ensure([], () => r(require('@V/APPQRCode')), 'APPQRCode')
        // },
        {
            path: '/NewsEvents',
            name: 'NewsEvents',
            meta: {
                // 最新公告
                title: 'home_014'
            },
            component: r => require.ensure([], () => r(require('@V/NewsEvents')), 'NewsEvents')
        },
        {
            path: '/WinLose',
            name: 'WinLose',
            meta: {
                // 输赢报表
                title: 'home_062'
            },
            component: r => require.ensure([], () => r(require('@V/WinLose')), 'WinLose')
        },
        {
            path: '/Wallet',
            name: 'Wallet',
            meta: {
                // 钱包记录
                title: 'home_012'
            },
            component: r => require.ensure([], () => r(require('@V/Wallet')), 'Wallet')
        },
        {
            path: '/History/:type',
            name: 'History',
            meta: {
                // 历史奖号
                title: '历史奖号'
            },
            component: r => require.ensure([], () => r(require('@V/History')), 'History')
        },
        {
            path: '/Redirect',
            name: 'Redirect',
            meta: {
                title: ''
            },
            component: r => require.ensure([], () => r(require('@V/Redirect')), 'Redirect')
        },
        {
            path: '/ScoreBoard',
            name: 'ScoreBoard',
            meta: {
                // 名人榜
                title: 'celebrity_001'
            },
            component: r => require.ensure([], () => r(require('@V/ScoreBoard')), 'ScoreBoard')
        },
        {
            path: '/SalesTime',
            name: 'SalesTime',
            meta: {
                // 贩售时间
                title: 'timetable_003'
            },
            component: r => require.ensure([], () => r(require('@V/SalesTime')), 'SalesTime')
        }
    ]
}
// if (process.env.NODE_ENV === 'development') {
//     route.routes = [
//         ...route.routes,
//         {
//             path: '/GuideStyle',
//             name: 'GuideStyle',
//             meta: {
//                 title: '前端开发手册'
//             },
//             component: r => require.ensure([], () => r(require('@V/GuideStyle')), 'GuideStyle')
//         }
//     ]
// }

export default new Router(route)
