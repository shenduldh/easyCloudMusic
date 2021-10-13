<template>
	<div class="flex items-center m-2">
		<button @click="playAll" class="text-sm ml-5 shadow-md p-1">播放全部</button>
		<button @click="remove" class="text-sm ml-5 shadow-md p-1">删除歌单</button>
		<input v-model="listName" class="ml-5 border-gray-200 border-2 w-80 h-5" type="text" />
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
			['歌曲名', '80%'],
			['歌手', '20%'],
		]"
		:items="songs"
		#="{ item }"
	>
		<td class="cursor-pointer" @click="play(item.id)">{{ item.name }}</td>
		<td>{{ item.singers }}</td>
	</Table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import lookupSong from '../../utils/lookupSong';
import Table from '../../components/Table.vue';
import { List } from '../../utils/types';

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
		};
	},
	computed: {
		listName: {
			get(): string {
				const list = this.$store.state.home.lists.find(list => list.id == this.id) as List;
				return list.name;
			},
			set(value: string) {
				this.$store.commit('home/UPDATE_LIST', { id: this.id, name: value });
			},
		},
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
		remove() {
			this.$store.commit('home/REMOVE_LIST', this.id);
			this.$router.push('/home/store');
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
			(newValue: number) => {
				this.whichPage = 1;

				const lists = this.$store.state.home.lists;
				const list = lists.find(list => list.id == newValue);
				if (list && list.songIds.length > 0) this.songIds = list.songIds;
				else this.songIds = [];
			},
			{ immediate: true }
		);
	},
});
</script>
