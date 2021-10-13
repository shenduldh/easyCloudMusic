import Cookies from 'js-cookie';
import md5 from 'md5';
import { FetchConfig, API, SearchType } from '../../types';

export default (apiType: API) => {
	const baseURL = 'https://ncmapi.ldh.vercel.app';
	const timestamp = new Date().getTime();
	const cookie = Cookies.get('netease') || '';

	const returnAPIConfig: { [index: number]: (...args: any[]) => FetchConfig } = {
		[API.LoginByEmail]: (account: string, password: string) => ({
			url: '/login',
			method: 'POST',
			baseURL,
			data: {
				email: account + '@163.com',
				md5_password: md5(password),
			},
		}),
		[API.LoginByPhone]: (account: string, password: string) => ({
			url: '/login/cellphone',
			method: 'POST',
			baseURL,
			data: {
				phone: account,
				md5_password: md5(password),
			},
		}),
		[API.GetUserInfo]: () => ({
			url: '/user/account',
			method: 'POST',
			baseURL,
			data: { cookie },
		}),
		[API.Search]: (
			keywords: string,
			type: SearchType = SearchType.单曲,
			limit: number = 50,
			offset: number = 0
		) => ({
			url: '/cloudsearch?timestamp=' + timestamp,
			method: 'POST',
			baseURL,
			data: {
				keywords: keywords,
				offset: offset * limit,
				limit,
				type,
			},
		}),
		[API.GetLyric]: (id: number) => ({
			url: '/lyric?timestamp=' + timestamp,
			method: 'POST',
			baseURL,
			data: { id },
		}),
		[API.GetLists]: (uid: number) => ({
			url: '/user/playlist?timestamp=' + timestamp,
			method: 'POST',
			baseURL,
			data: { uid, cookie },
		}),
		[API.GetListDetail]: (id: number) => ({
			url: '/playlist/detail?timestamp=' + timestamp,
			method: 'POST',
			baseURL,
			data: { id, cookie },
		}),
		[API.GetSongDetail]: (ids: number[]) => ({
			url: '/song/detail?timestamp=' + timestamp,
			method: 'POST',
			baseURL,
			data: { ids: ids.join(','), cookie },
		}),
		[API.GetSongUrl]: (ids: number[]) => ({
			url: '/song/url?timestamp=' + timestamp,
			method: 'POST',
			baseURL,
			data: { id: ids.join(','), cookie },
		}),
		[API.GetDailyLists]: () => ({
			url: '/recommend/resource?timestamp=' + timestamp,
			method: 'POST',
			baseURL,
			data: { cookie },
		}),
		[API.GetDailySongs]: () => ({
			url: '/recommend/songs?timestamp=' + timestamp,
			method: 'POST',
			baseURL,
			data: { cookie },
		}),
		[API.GetCloudSongs]: () => ({
			url: '/user/cloud?timestamp=' + timestamp,
			method: 'POST',
			baseURL,
			data: { cookie },
		}),
	};
	return returnAPIConfig[apiType];
};
