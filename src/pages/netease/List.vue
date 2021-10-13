<template>
	<div class="flex items-center m-2">
		<button @click="playAll" class="text-sm ml-5 shadow-md p-1">播放全部</button>
		<div class="flex justify-evenly shadow-md w-60 ml-5">
			<p
				class="text-gray-500 cursor-pointer"
				@click="whichPage = index + 1"
				v-for="(_, index) in new Array(pageCount)"
				:key="index"
			>
				{{ index + 1 }}
			</p>
		</div>
	</div>
	<Table
		class="p-3"
		:heads="[
			['歌曲名', '70%'],
			['歌手', '20%'],
			['操作', '10%'],
		]"
		:items="songs"
		#="{ item }"
	>
		<td class="cursor-pointer" @click="play(item.id)">{{ item.name }}</td>
		<td>{{ item.singers }}</td>
		<td>
			<button
				@click="
					isShowAddUI = !isShowAddUI;
					addSongId = item.id;
				"
			>
				+
			</button>
		</td>
	</Table>
	<div
		class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-gray-100"
		v-show="isShowAddUI"
	>
		<button
			@click="
				$store.commit('home/ADD_SONG', { id: list.id, songId: addSongId });
				isShowAddUI = false;
			"
			v-for="list in $store.state.home.lists"
			:key="list.id"
		>
			{{ list.name }}
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import lookupSong from '../../utils/lookupSong';
import { List, Song } from '../../utils/types';
import Table from '../../components/Table.vue';

export default defineComponent({
	components: { Table },
	props: ['id'],
	data() {
		const songs: { id: number; name: string; singers: string }[] = [];
		const songIds: number[] = [];
		return {
			pageCount: 1,
			whichPage: 1,
			showCount: 200,
			songIds,
			songs,
			isShowAddUI: false,
			addSongId: 0,
		};
	},
	methods: {
		play(id: number) {
			window.player.insert(id);
			window.player.play(id);
		},
		playAll() {
			const start = (this.whichPage - 1) * this.showCount;
			const end = this.whichPage * this.showCount;
			const ids: number[] = this.songIds.slice(start, end);
			window.player.clear();
			window.player.add(ids);
			window.player.play(this.songIds[0]);
		},
	},
	mounted() {
		// <待改写> 临时缓存 **********
		const data = localStorage.getItem('songs');
		if (data) this.$store.state.netease.songs = JSON.parse(data);
		// ******************************

		this.$watch(
			() => ({ whichPage: this.whichPage, songIds: this.songIds }),
			async (newValue: { whichPage: number; songIds: number[] }) => {
				if (!newValue.songIds) return;

				const start = (newValue.whichPage - 1) * this.showCount;
				const end = newValue.whichPage * this.showCount;
				const ids: number[] = newValue.songIds.slice(start, end);
				const detail = await lookupSong(ids);
				this.songs = detail.map(song => ({
					id: song.id,
					name: song.name,
					singers: song.singers.map(singer => singer.name).join('|'),
				}));

				const songCount = newValue.songIds.length;
				this.pageCount = Math.ceil(songCount / this.showCount);
			},
			{ deep: true, immediate: true }
		);

		this.$watch(
			() => this.id,
			async (newValue: number | string) => {
				this.whichPage = 1;

				// 从已有库中查找
				const lists = this.$store.state.netease.lists;
				const list = lists.find(list => list.id == newValue);
				if (list && list.songIds.length > 0) {
					this.songIds = list.songIds;
					return;
				}

				// 从网上获取
				if (newValue == 'dailySongs') {
					const songs: Song[] = await this.$store.dispatch('netease/get_daily_songs');
					this.songIds = songs.map(song => song.id);
					return;
				}
				if (newValue == 'cloud') {
					const songs: Song[] = await this.$store.dispatch('netease/get_cloud_songs');
					this.songIds = songs.map(song => song.id);
					return;
				}
				const detail: List = await this.$store.dispatch('netease/get_list_detail', newValue);
				this.songIds = detail.songIds;
			},
			{ immediate: true }
		);
	},
});
</script>
