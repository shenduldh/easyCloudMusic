<template>
	<div v-show="isShow" class="shadow-md absolute mb-80 right-0 w-64 h-64 bg-gray-100 overflow-auto">
		<button @click="clear" class="mx-2 mt-2 border-2 border-gray-400">清空列表</button>
		<div class="flex items-center" v-for="song in detail" :key="song.id">
			<p :title="song.name" @click="play(song.id)" class="truncate cursor-pointer text-sm m-1">
				{{ song.name }}
			</p>
			<Icon class="cursor-pointer" @click="remove(song.id)" name="remove" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import lookupSong from '../utils/lookupSong';

export default defineComponent({
	props: {
		list: {
			require: true,
			type: Object as PropType<number[]>,
		},
		isShow: {
			require: true,
			type: Boolean,
		},
	},
	data() {
		const detail: { id: number; name: string }[] = [];
		return { detail };
	},
	methods: {
		clear() {
			window.player.clear();
		},
		play(id: number) {
			window.player.play(id);
		},
		remove(id: number) {
			window.player.remove([id]);
		},
	},
	mounted() {
		this.$watch(
			() => this.list,
			async (newValue: number[]) => {
				const detail = await lookupSong(newValue);
				this.detail = detail.map(song => ({ id: song.id, name: song.name }));
			},
			{ deep: true }
		);
	},
});
</script>

<style scoped></style>
