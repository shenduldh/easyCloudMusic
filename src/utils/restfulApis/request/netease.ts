import fetch from '../fetch';
import getNcmApiConfig from '../ApiConfig/netease';
import { API } from '../../types';

export default {
	[API.LoginByEmail](account: string, password: string) {
		const config = getNcmApiConfig(API.LoginByEmail)(account, password);
		return fetch(config).then(data => data.cookie);
	},
	[API.LoginByPhone](account: string, password: string) {
		const config = getNcmApiConfig(API.LoginByPhone)(account, password);
		return fetch(config).then(data => data.cookie);
	},
	[API.GetUserInfo]() {
		const config = getNcmApiConfig(API.GetUserInfo)();
		return fetch(config).then(data => ({
			id: data.profile.userId,
			name: data.profile.nickname,
			avatar: data.profile.avatarUrl,
		}));
	},
	[API.GetLists](uid: number) {
		const config = getNcmApiConfig(API.GetLists)(uid);
		return fetch(config).then(data =>
			(data.playlist as any[]).map(list => ({
				id: list.id,
				name: list.name,
				userId: list.userId,
				type: ['mine'],
				cover: list.coverImgUrl,
				count: list.trackCount,
				songIds: [],
			}))
		);
	},
	[API.GetListDetail](id: number) {
		const config = getNcmApiConfig(API.GetListDetail)(id);
		return fetch(config).then(data => ({
			detail: {
				id: data.playlist.id,
				name: data.playlist.name,
				type: [],
				cover: data.playlist.coverImgUrl,
				userId: data.playlist.userId,
				count: data.playlist.trackCount,
				songIds: (data.playlist.trackIds as any[]).map(song => song.id),
			},
			songs: (data.playlist.tracks as any[]).map(song => ({
				id: song.id,
				name: song.name,
				cover: song.al.picUrl,
				copyright: song.noCopyrightRcmd != null,
				singers: (song.ar as any[]).map(singer => ({ id: singer.id, name: singer.name })),
				url: null,
			})),
		}));
	},
	[API.GetSongDetail](ids: number[]) {
		const config = getNcmApiConfig(API.GetSongDetail)(ids);
		return fetch(config).then(data =>
			(data.songs as any[]).map(song => ({
				id: song.id,
				name: song.name,
				cover: song.al.picUrl,
				copyright: song.noCopyrightRcmd != null,
				singers: (song.ar as any[]).map(singer => ({ id: singer.id, name: singer.name })),
				url: null,
			}))
		);
	},
	[API.GetSongUrl](ids: number[]) {
		const config = getNcmApiConfig(API.GetSongUrl)(ids);
		return fetch(config).then(data =>
			(data.data as any[]).map(song => ({
				id: song.id,
				url: song.url || null,
			}))
		);
	},
	[API.GetDailyLists]() {
		const config = getNcmApiConfig(API.GetDailyLists)();
		return fetch(config).then(data =>
			(data.recommend as any[]).map(list => ({
				id: list.id,
				name: list.name,
				type: ['daily'],
				cover: list.picUrl,
				userId: list.userId,
				count: list.trackCount,
				songIds: [],
			}))
		);
	},
	[API.GetDailySongs]() {
		const config = getNcmApiConfig(API.GetDailySongs)();
		return fetch(config).then(data =>
			(data.data.dailySongs as any[]).map(song => ({
				id: song.id,
				name: song.name,
				cover: song.al.picUrl,
				copyright: song.noCopyrightRcmd != null,
				singers: (song.ar as any[]).map(singer => ({ id: singer.id, name: singer.name })),
				url: null,
			}))
		);
	},
	[API.GetCloudSongs]() {
		const config = getNcmApiConfig(API.GetCloudSongs)();
		return fetch(config).then(data =>
			(data.data as any[]).map(song => ({
				id: song.simpleSong.id,
				name: song.simpleSong.name,
				cover: song.simpleSong.al.picUrl,
				copyright: song.simpleSong.noCopyrightRcmd != null,
				singers: (song.simpleSong.ar as any[]).map(singer => ({ id: singer.id, name: singer.name || '未知' })),
				url: null,
			}))
		);
	},
	[API.GetLyric](id: number) {
		const config = getNcmApiConfig(API.GetLyric)(id);
		return fetch(config).then(data => (data.lrc ? data.lrc.lyric : '暂无歌词'));
	},
	[API.SearchSongs](keywords: string) {
		const config = getNcmApiConfig(API.Search)(keywords);
		return fetch(config).then(data => ({
			count: data.result,
			songs: (data.result.songs as any[]).map(song => ({
				id: song.id,
				name: song.name,
				cover: song.al.picUrl,
				copyright: song.noCopyrightRcmd != null,
				singers: (song.ar as any[]).map(singer => ({ id: singer.id, name: singer.name })),
				url: null,
			})),
		}));
	},
};
