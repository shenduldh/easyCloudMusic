import { Method } from 'axios';

interface User {
	id: number;
	name: string;
	avatar: string;
}

type ListType = 'mine' | 'daily' | 'other';

interface List {
	id: number | string;
	name: string;
	type: ListType[];
	userId: number;
	cover: string;
	count: number;
	songIds: number[];
}

interface Song {
	id: number;
	name: string;
	url: string | null;
	cover: string;
	copyright: boolean;
	singers: {
		id: number;
		name: string;
	}[];
}

interface NeteaseState {
	user: User;
	lists: List[];
	songs: Song[];
}

interface HomeState {
	lists: List[];
}

interface State {
	netease: NeteaseState;
	home: HomeState;
}

enum SearchType {
	单曲 = 1,
	专辑 = 10,
	歌手 = 100,
	歌单 = 1000,
	用户 = 1002,
	MV = 1004,
	歌词 = 1006,
	电台 = 1009,
	视频 = 1014,
	综合 = 1018,
}

enum Path {
	Root = '/',
	Login = '/login/:platform',
	Home = '/home',
	Netease = '/netease',
	Tencent = '/tencent',
	Store = '/store',
	List = '/list/:id',
	Daily = '/daily',
	Cloud = '/cloud',
	Search = '/search',
	Song = '/song',
}

enum Platform {
	Netease = '网易云音乐',
	Tencent = 'QQ音乐',
}

interface FetchConfig {
	url: string;
	method: Method;
	baseURL: string;
	data?: { [index: string]: string | number };
}

enum API {
	LoginByEmail,
	LoginByPhone,
	GetUserInfo,
	Search,
	SearchSongs,
	GetLyric,
	GetLists,
	GetListDetail,
	GetSongDetail,
	GetSongUrl,
	GetDailyLists,
	GetDailySongs,
	GetCloudSongs,
}

export { NeteaseState, HomeState, State, User, List, Song, Path, SearchType, Platform, FetchConfig, API };
