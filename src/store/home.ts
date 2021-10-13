import { ActionContext } from 'vuex';
import { List, State, HomeState } from '../utils/types';

const state: HomeState = {
	lists: [],
};

const getters = {};

const mutations: { [index: string]: (state: HomeState, data: any) => void } = {
	SET_LISTS(state) {
		const data = localStorage.getItem('home_lists');
		if (data) {
			const lists: List[] = JSON.parse(data);
			state.lists = lists;
		}
	},
	ADD_LIST(state, data: List) {
		let randomId: number;
		do {
			randomId = Math.floor(Math.random() * 99999999);
		} while (state.lists.some(list => list.id == randomId));

		const list: List = {
			id: randomId,
			name: data.name,
			cover: 'https://picsum.photos/300/300',
			songIds: data.songIds,
			type: ['mine'],
			userId: -1,
			count: data.songIds.length,
		};

		state.lists.push(list);

		localStorage.setItem('home_lists', JSON.stringify(state.lists));
	},
	UPDATE_LIST(state, data: { id: number; name: string }) {
		const list = state.lists.find(list => list.id == data.id);
		if (list) list.name = data.name;

		localStorage.setItem('home_lists', JSON.stringify(state.lists));
	},
	REMOVE_LIST(state, id) {
		const listIndex = state.lists.findIndex(list => list.id == id);
		if (listIndex >= 0) state.lists.splice(listIndex, 1);

		localStorage.setItem('home_lists', JSON.stringify(state.lists));
	},
	ADD_SONG(state, data: { id: number; songId: number }) {
		const list = state.lists.find(list => list.id == data.id);
		if (list) {
			if (!list.songIds.includes(data.songId)) {
				list.songIds.push(data.songId);
				list.count++;
			}
		}

		localStorage.setItem('home_lists', JSON.stringify(state.lists));
	},
	REMOVE_SONG(state, data: { id: number; songId: number }) {
		const list = state.lists.find(list => list.id == data.id);
		if (list) {
			const index = list.songIds.findIndex(songId => songId == data.songId);
			if (index >= 0) {
				list.songIds.splice(index, 1);
				list.count--;
			}
		}

		localStorage.setItem('home_lists', JSON.stringify(state.lists));
	},
};

const actions: { [index: string]: (ctx: ActionContext<HomeState, State>, data: any) => Promise<any> } = {};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
