import axios from 'axios';
import { FetchConfig } from './types';

export default (config: FetchConfig) => {
	return new Promise<any>((resolve, reject) => {
		axios
			.request({
				...config,
				timeout: 6 * 1000,
				withCredentials: true,
				validateStatus: () => true,
			})
			.then(res => resolve(res.data))
			.catch(error => reject(error));
	});
};
