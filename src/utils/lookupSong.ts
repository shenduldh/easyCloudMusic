import store from '../store';
import { Song } from './types';

export default async (songIds: number[]) => {
	const notExistedIDs: number[] = [];
	const songs = store.state.netease.songs;
	const detail: Song[] = [];
	songIds.forEach(id => {
		const song = songs.find(song => song.id == id);
		if (song) detail.push(song);
		else {
			detail.push({ id, name: '', cover: '', copyright: false, url: null, singers: [] });
			notExistedIDs.push(id);
		}
	});
	if (notExistedIDs.length > 0) {
		const songs: Song[] = await store.dispatch('netease/get_song_detail', notExistedIDs);
		songs.forEach(song => {
			const target = detail.find(val => val.id == song.id) as Song;
			target.name = song.name;
			target.cover = song.cover;
			target.copyright = song.copyright;
			target.url = song.url;
			target.singers = song.singers;
		});
	}
	return detail;
};
