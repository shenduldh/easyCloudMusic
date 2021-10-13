import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { Path } from '../utils/types';
import Cookies from 'js-cookie';
import store from '../store';

const routes: RouteRecordRaw[] = [
	{ path: Path.Root, redirect: Path.Home },
	{ path: Path.Login, component: () => import('../pages/Login.vue'), props: true },
	{
		path: Path.Search,
		component: () => import('../pages/search/index.vue'),
		children: [
			{
				path: Path.Search + Path.Song,
				component: () => import('../pages/search/Song.vue'),
				props: route => ({ keywords: route.query.kws }),
			},
		],
	},
	{
		path: Path.Home,
		component: () => import('../pages/home/index.vue'),
		redirect: Path.Home + Path.Store,
		children: [
			{
				path: Path.Home + Path.Store,
				component: () => import('../pages/home/Store.vue'),
				meta: { name: '我的歌单' },
			},
			{
				path: Path.Home + Path.List,
				component: () => import('../pages/home/List.vue'),
				props: true,
			},
		],
	},
	{
		path: Path.Netease,
		component: () => import('../pages/netease/index.vue'),
		redirect: Path.Netease + Path.Store,
		children: [
			{
				path: Path.Netease + Path.Store,
				component: () => import('../pages/netease/Store.vue'),
				meta: { name: '我的歌单' },
			},
			{
				path: Path.Netease + Path.List,
				component: () => import('../pages/netease/List.vue'),
				props: true,
			},
			{
				path: Path.Netease + Path.Daily,
				component: () => import('../pages/netease/Daily.vue'),
				meta: { name: '每日推荐' },
			},
			{
				path: Path.Netease + Path.Cloud,
				redirect: Path.Netease + '/list/cloud',
				meta: { name: '我的云盘' },
			},
		],
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

router.beforeEach(async (to, _, next) => {
	if (to.fullPath.startsWith('/netease')) {
		if (Cookies.get('netease')) {
			if (store.state.netease.user.id < 0) await store.dispatch('netease/get_user_info');
			next();
			return;
		}
		next('/login/netease');
		return;
	}
	next();
});

// router.afterEach(() => {});

export default router;
