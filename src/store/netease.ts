import { ActionContext } from 'vuex';
import requestNetease from '../utils/restfulApis/request/netease';
import { List, State, NeteaseState, User, Song, API } from '../utils/types';

const state: NeteaseState = {
	user: { id: -1, name: '', avatar: '' },
	lists: [],
	songs: [],
};

const getters = {};

const mutations: { [index: string]: (state: NeteaseState, data: any) => void } = {
	SET_USER_INFO(state, userInfo: User) {
		const user = state.user;
		user.id = userInfo.id;
		user.name = userInfo.name;
		user.avatar = userInfo.avatar;
	},
	ADD_LISTS(state, datas: List[]) {
		const lists = state.lists;
		datas.forEach(data => {
			const targetList = lists.find(list => list.id == data.id);
			if (targetList) {
				targetList.name = data.name;
				targetList.userId = data.userId;
				targetList.cover = data.cover;
				targetList.count = data.count;
				targetList.songIds = data.songIds;
				data.type.forEach(val => {
					if (!targetList.type.includes(val)) targetList.type.push(val);
				});
				return;
			}
			lists.push(data);
		});

		// <待改写> 临时缓存 **********
		localStorage.setItem('lists', JSON.stringify(state.lists.filter(list => list.type.includes('mine'))));
		// ******************************
	},
	ADD_SONG_DETAIL(state, datas: Song[]) {
		const songs = state.songs;
		datas.forEach(data => {
			const targetSong = songs.find(song => song.id == data.id);
			if (targetSong) {
				targetSong.name = data.name;
				targetSong.cover = data.cover;
				targetSong.copyright = data.copyright;
				targetSong.singers = data.singers;
				return;
			}
			songs.push(data);
		});

		// <待改写> 临时缓存 **********
		localStorage.setItem('songs', JSON.stringify(state.songs));
		// ******************************
	},
	ADD_SONG_URL(state, datas: { id: number; url: string | null }[]) {
		datas.forEach(data => {
			const targetSong = state.songs.find(song => song.id == data.id);
			if (targetSong) targetSong.url = data.url;
		});

		// <待改写> 临时缓存 **********
		localStorage.setItem('songs', JSON.stringify(state.songs));
		// ******************************
	},
};

const actions: { [index: string]: (ctx: ActionContext<NeteaseState, State>, data: any) => Promise<any> } = {
	get_user_info(ctx) {
		return requestNetease[API.GetUserInfo]().then(userInfo => ctx.commit('SET_USER_INFO', userInfo));
	},
	get_lists(ctx, uid: number) {
		// <待改写> 临时缓存 **********
		const data = localStorage.getItem('lists');
		if (data) {
			const lists = JSON.parse(data) as List[];
			if (lists.length > 1) {
				ctx.commit('ADD_LISTS', lists);
				return Promise.resolve(data);
			}
		}
		// ******************************

		return requestNetease[API.GetLists](uid).then(lists => {
			ctx.commit('ADD_LISTS', lists);
			return lists;
		});
	},
	get_list_detail(ctx, listId: number) {
		return requestNetease[API.GetListDetail](listId).then(list => {
			ctx.commit('ADD_LISTS', [list.detail]);
			ctx.commit('ADD_SONG_DETAIL', list.songs);
			return list.detail;
		});
	},
	get_song_detail(ctx, songIds: number[]) {
		return requestNetease[API.GetSongDetail](songIds).then(songDetail => {
			ctx.commit('ADD_SONG_DETAIL', songDetail);
			return songDetail;
		});
	},
	get_song_url(ctx, songIds: number[]) {
		return requestNetease[API.GetSongUrl](songIds).then(data => {
			ctx.commit('ADD_SONG_URL', data);
			return data;
		});
	},
	get_daily_lists(ctx) {
		return requestNetease[API.GetDailyLists]().then(data => {
			ctx.commit('ADD_LISTS', data);
			return data;
		});
	},
	get_daily_songs(ctx, type) {
		return requestNetease[API.GetDailySongs]().then(data => {
			const list: List = {
				id: 'dailySongs',
				name: '每日推荐歌曲',
				userId: ctx.state.user.id,
				type: type ? [type] : [],
				songIds: data.map(song => song.id),
				cover: 'https://picsum.photos/300/300',
				count: data.length,
			};
			ctx.commit('ADD_LISTS', [list]);
			ctx.commit('ADD_SONG_DETAIL', data);
			return data;
		});
	},
	get_cloud_songs(ctx, type) {
		return requestNetease[API.GetCloudSongs]().then(data => {
			const list: List = {
				id: 'cloud',
				name: '云盘歌曲',
				userId: ctx.state.user.id,
				type: type ? [type] : [],
				songIds: data.map(song => song.id),
				cover: 'https://picsum.photos/300/300',
				count: data.length,
			};
			ctx.commit('ADD_LISTS', [list]);
			ctx.commit('ADD_SONG_DETAIL', data);
			return data;
		});
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
