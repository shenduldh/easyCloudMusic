<template>
	<div
		v-show="isShow"
		@click="$emit('update:isShow', false)"
		class="fixed top-0 left-0 w-screen h-screen bg-gray-50 z-50 overflow-auto p-5"
	>
		<p class="w-80 mx-auto" v-for="(str, index) in lyric" :key="index">{{ str }}</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import requestNetease from '../utils/restfulApis/request/netease';
import { API } from '../utils/types';

export default defineComponent({
	props: ['id', 'isShow'],
	data() {
		const lyric: string[] = [];
		return {
			lyric,
		};
	},
	mounted() {
		this.$watch(
			() => this.id,
			async (newValue: number) => {
				if (newValue < 0) return;
				const res: string = await requestNetease[API.GetLyric](newValue);
				this.lyric = res.split('\n');
			},
			{ immediate: true }
		);
	},
});
</script>

<style scoped></style>
