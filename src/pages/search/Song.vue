<template>
	<Table
		class="p-5 w-full"
		:heads="[
			['歌曲名', '80%'],
			['歌手', '20%'],
		]"
		:items="searchResult"
		#="{ item }"
	>
		<td class="cursor-pointer" :title="item.name" @click="play(item.id)">{{ item.name }}</td>
		<td :title="item.singers.map(s => s.name).join('|')">
			{{ item.singers.map(s => s.name).join('|') }}
		</td>
	</Table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import requestNetease from '../../utils/restfulApis/request/netease';
import Table from '../../components/Table.vue';
import { API } from '../../utils/types';

export default defineComponent({
	components: { Table },
	props: ['keywords'],
	data() {
		return {
			searchResult: [] as Array<any>,
		};
	},
	methods: {
		play(id: number) {
			window.player.insert(id);
			window.player.play(id);
		},
	},
	mounted() {
		this.$watch(
			() => this.keywords,
			async (newValue: string) => {
				const res = await requestNetease[API.SearchSongs](newValue);
				this.searchResult = res.songs;
			},
			{ immediate: true }
		);
	},
});
</script>

<style scoped></style>
